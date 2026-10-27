import bcrypt from "bcryptjs";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import defaults from "../../../../public/nqk-default.json";
import { load, save, mutate, saveFile, loadFile, deleteFile } from "@/lib/nqk/store";
import { clearCookie, makeCookie, readSession, type Session } from "@/lib/nqk/auth";
import { driveCall, mailSettings, notifyBrief, notifyLead, quoteHtml, sendMail, siteContent } from "@/lib/nqk/mail";

/* Thay cho api.php cũ: cùng các chức năng (?a=...), dữ liệu lưu trong Vercel Blob. */
/* eslint-disable @typescript-eslint/no-explicit-any */
type A = any;

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const MAX_CONTENT = 600000;
const UPLOAD_MAX = 3000000; // Vercel giới hạn body 4,5 MB, base64 tăng ~33%
const H = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

class Fail extends Error {
  constructor(msg: string, public code = 400) { super(msg); }
}
const fail = (m: string, c = 400): never => { throw new Fail(m, c); };

const json = (data: unknown, code = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status: code, headers: { ...H, "Content-Type": "application/json; charset=utf-8", ...extra } });

const str = (v: unknown, max: number): string =>
  String(v ?? "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, max);

/** Giờ Việt Nam dạng yymmddHHMMSS và ISO có múi giờ +07:00 */
function vn(d = new Date()) {
  const p = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Ho_Chi_Minh", year: "2-digit", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" })
    .formatToParts(d).reduce<Record<string, string>>((o, x) => { o[x.type] = x.value; return o; }, {});
  return { stamp: `${p.year}${p.month}${p.day}${p.hour}${p.minute}${p.second}`, ymd: `${p.year}${p.month}${p.day}`, ym: `${p.year}${p.month}`, iso: d.toISOString() };
}
const newId = () => vn().stamp + "-" + randomBytes(3).toString("hex");
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const num = (v: unknown) => Math.max(0, Math.trunc(Number(v) || 0));
const ipKey = (req: Request) =>
  createHash("sha256").update((req.headers.get("x-forwarded-for") || "0.0.0.0").split(",")[0].trim() + "|nqk").digest("hex").slice(0, 16);
const hostOf = (req: Request) => req.headers.get("host") || "nguyenquockhanh.vn";
const isSecure = (req: Request) => (req.headers.get("x-forwarded-proto") || new URL(req.url).protocol.replace(":", "")) === "https";

async function body(req: Request, max = MAX_CONTENT): Promise<A> {
  const raw = await req.text();
  if (raw.length > max) fail("Dữ liệu quá lớn.", 413);
  try { const j = JSON.parse(raw); return j && typeof j === "object" ? j : {}; } catch { return {}; }
}

async function requireAdmin(req: Request, post: boolean): Promise<Session> {
  const s = await readSession(req);
  if (!s) fail("Phiên đăng nhập đã hết. Đăng nhập lại.", 401);
  if (post) {
    const t = req.headers.get("x-csrf") || "";
    const a = Buffer.from(t), b = Buffer.from(s!.csrf);
    if (a.length !== b.length || !timingSafeEqual(a, b)) fail("Phiên làm việc không hợp lệ. Tải lại trang admin.", 403);
  }
  return s!;
}

async function rateLimit(req: Request) {
  await mutate<Record<string, number[]>, void>("rate", {}, (r) => {
    const k = ipKey(req), now = Date.now() / 1000;
    for (const kk of Object.keys(r)) { r[kk] = r[kk].filter((t) => now - t < 600); if (!r[kk].length) delete r[kk]; }
    if ((r[k] ?? []).length >= 6) fail("Bạn đã gửi nhiều lần. Vui lòng nhắn trực tiếp qua Zalo.", 429);
    (r[k] ??= []).push(now);
  });
}
async function throttleLogin(req: Request, failed = false) {
  await mutate<Record<string, { n: number; t: number }>, void>("throttle", {}, (t) => {
    const k = ipKey(req), now = Date.now() / 1000;
    for (const kk of Object.keys(t)) if (now - (t[kk].t ?? 0) > 900) delete t[kk];
    const e = t[k] ?? { n: 0, t: now };
    if (e.n >= 5 && now - e.t < 900) fail("Sai mật khẩu quá nhiều lần. Thử lại sau 15 phút.", 429);
    if (failed) { e.n++; e.t = now; t[k] = e; }
  });
}

function cleanTree(v: A, depth = 0): A {
  if (depth > 5) return null;
  if (v === null || typeof v === "boolean" || typeof v === "number") return v;
  if (typeof v === "string") return str(v, 4000);
  if (Array.isArray(v)) return v.slice(0, 300).map((x) => cleanTree(x, depth + 1));
  if (typeof v === "object") {
    const o: A = {}; let n = 0;
    for (const [k, x] of Object.entries(v)) {
      if (++n > 300) break;
      const key = k.replace(/[^A-Za-z0-9_]/g, "");
      if (key) o[key] = cleanTree(x, depth + 1);
    }
    return o;
  }
  return null;
}

async function driveOrFail(data: A, timeout = 60000): Promise<A> {
  const r = await driveCall(data, timeout);
  if (!r.j && !r.ok) fail(r.err || "Không kết nối được Google Drive.", 502);
  if (!r.ok) {
    const e = String(r.err ?? "lỗi không rõ");
    if (/permission|authoriz|quyền/i.test(e)) fail("Apps Script chưa được cấp quyền Google Drive. Mở dự án Apps Script, chạy hàm capQuyen một lần và bấm Cho phép.", 403);
    if (/unknown action/i.test(e) || e === "no recipient") fail("Apps Script chưa được cập nhật bản hỗ trợ Drive.", 409);
    if (/Chưa cài đặt/.test(e)) fail(e);
    fail("Google Drive báo lỗi: " + e, 502);
  }
  return r.j;
}

const COMPANY_DEF = { name: "CÔNG TY CỔ PHẦN HORUS BRANDING", short: "Horus Branding", tax: "0402052897",
  address: "28 Cẩm Nam 1, Phường Hòa Xuân, Quận Cẩm Lệ, TP Đà Nẵng", rep: "Nguyễn Quốc Khánh", role: "Giám đốc",
  phone: "0988 886 901", email: "khanhdesignvn@gmail.com", web: "www.horusbranding.com",
  bank: "", account: "", holder: "", suffix: "BRANDING", revisions: "3" };

async function handle(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const a = url.searchParams.get("a") || "";
  const post = req.method === "POST";
  const needPost = () => { if (!post) fail("Cần gửi bằng POST.", 405); };
  const host = hostOf(req);

  switch (a) {
    case "content": {
      const c = await load<A>("content", null);
      return json({ ok: true, content: c ?? defaults });
    }

    case "lead": {
      needPost();
      const b = await body(req);
      if (b.website) return json({ ok: true });
      const name = str(b.name, 80), zalo = str(b.zalo, 20), digits = zalo.replace(/\D/g, "");
      if (!name) fail("Thiếu tên liên hệ.");
      if (digits.length < 9 || digits.length > 12) fail("Số Zalo chưa đúng.");
      const email = str(b.email, 120);
      if (email && !isEmail(email)) fail("Email chưa đúng.");
      const items = (Array.isArray(b.items) ? b.items : []).slice(0, 60).filter((x: A) => x && typeof x === "object").map((it: A) => ({
        pkg: str(it.pkg, 80), name: str(it.name, 120), qty: str(it.qty, 30), amount: num(it.amount),
        desc: str(it.desc, 600), note: str(it.note, 500), skip: str((Array.isArray(it.skip) ? it.skip.slice(0, 20) : []).join(", "), 400),
      }));
      const lead = {
        id: newId(), time: vn().iso, name, zalo, note: str(b.note, 1000), email,
        quote: str(b.quote, 40).toUpperCase().replace(/[^A-Z0-9./-]/g, ""), brand: str(b.brand, 100),
        source: ["form", "zalo"].includes(b.source) ? b.source : "form",
        items, subtotal: num(b.subtotal), discount: num(b.discount), total: num(b.total),
        status: "new", adminNote: "", ua: str(req.headers.get("user-agent"), 160),
      };
      await rateLimit(req);
      await mutate<A[], void>("leads", [], (L) => { L.unshift(lead); if (L.length > 5000) L.length = 5000; });
      await notifyLead(lead, host);
      return json({ ok: true });
    }

    case "brief": {
      needPost();
      const b = await body(req, 4000000);
      if (b.website) return json({ ok: true });
      const name = str(b.name, 80), brand = str(b.brand, 100), zalo = str(b.phone, 20), digits = zalo.replace(/\D/g, "");
      if (!name || !brand) fail("Thiếu tên hoặc tên thương hiệu.");
      if (digits.length < 9 || digits.length > 12) fail("Số điện thoại chưa đúng.");
      const email = str(b.email, 120);
      if (email && !isEmail(email)) fail("Email chưa đúng.");
      const rows: string[][] = [];
      for (const r of (Array.isArray(b.rows) ? b.rows : []).slice(0, 30)) {
        if (!Array.isArray(r) || r.length < 2) continue;
        const k = str(r[0], 40), v = str(r[1], 1500);
        if (k && v) rows.push([k, v]);
      }
      let pdf: Buffer | null = null;
      if (typeof b.pdf === "string" && b.pdf) {
        const raw = Buffer.from(b.pdf.replace(/^data:application\/pdf[^,]*,/, ""), "base64");
        if (raw.subarray(0, 4).toString() === "%PDF" && raw.length < 2900000) pdf = raw;
      }
      await rateLimit(req);
      const id = newId();
      const lead: A = {
        id, time: vn().iso, name, zalo, email, brand, note: "",
        quote: /^BR-\d{6}-[A-Z0-9]{3}$/.test(String(b.code ?? "")) ? b.code : `BR-${vn().ymd}-${id.slice(-3).toUpperCase()}`,
        source: "brief", brief: rows, pdf: !!pdf, items: [], subtotal: 0, discount: 0, total: 0,
        status: "new", adminNote: "", ua: str(req.headers.get("user-agent"), 160),
      };
      if (pdf) await saveFile(`briefs/${id}.pdf`, pdf, "application/pdf");
      await mutate<A[], void>("leads", [], (L) => { L.unshift(lead); if (L.length > 5000) L.length = 5000; });
      const sent = await notifyBrief(lead, pdf, host);
      if (!sent) await mutate<A[], void>("leads", [], (L) => { for (const x of L) if (x.id === id) x.mailFail = true; });
      return json({ ok: true, code: lead.quote });
    }

    case "brief_pdf": {
      await requireAdmin(req, false);
      const id = (url.searchParams.get("id") || "").replace(/[^0-9a-f-]/g, "");
      const buf = id ? await loadFile(`briefs/${id}.pdf`) : null;
      if (!buf) fail("Không tìm thấy file PDF.", 404);
      return new Response(new Uint8Array(buf!), { headers: { ...H, "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="brief-${id}.pdf"` } });
    }

    case "jobs": {
      await requireAdmin(req, false);
      return json({ ok: true, jobs: await load<A[]>("jobs", []), uploadMax: UPLOAD_MAX });
    }

    case "job_save": {
      needPost(); await requireAdmin(req, true);
      const inp = cleanTree((await body(req)).job);
      if (!inp || typeof inp !== "object" || Array.isArray(inp)) fail("Dữ liệu dự án không hợp lệ.");
      const job = await mutate<A[], A>("jobs", [], (J) => {
        const id = String(inp.id ?? "");
        if (id) {
          const i = J.findIndex((j) => j.id === id);
          if (i < 0) fail("Không tìm thấy dự án.", 404);
          const j = J[i];
          inp.drive = j.drive ?? inp.drive ?? null; inp.code = j.code; inp.created = j.created; inp.updated = vn().iso;
          J[i] = inp; return inp;
        }
        const ym = vn().ym; let n = 1;
        for (const j of J) { const m = String(j.code ?? "").match(new RegExp(`^DA-${ym}-(\\d+)$`)); if (m) n = Math.max(n, +m[1] + 1); }
        inp.id = newId(); inp.code = `DA-${ym}-${String(n).padStart(2, "0")}`; inp.created = inp.updated = vn().iso;
        delete inp.drive;
        J.unshift(inp); if (J.length > 2000) J.length = 2000;
        return inp;
      });
      return json({ ok: true, job });
    }

    case "job_delete": {
      needPost(); await requireAdmin(req, true);
      const id = String((await body(req)).id ?? "");
      await mutate<A[], void>("jobs", [], (J) => { const k = J.filter((j) => j.id !== id); J.length = 0; J.push(...k); });
      return json({ ok: true });
    }

    case "drive_folder": {
      needPost(); await requireAdmin(req, true);
      const jid = String((await body(req)).id ?? "");
      const job = findJob(await load<A[]>("jobs", []), jid);
      const name = `${job.code ?? ""} · ${job.client?.brand || job.name || "Dự án"}`.trim();
      const r = await driveOrFail({ action: "folder", name, id: job.drive?.id ?? "" });
      job.drive = { id: r.id, url: r.url, sub: r.sub ?? [], shared: job.drive?.shared ?? {} };
      const lid = String(job.leadId ?? "").replace(/[^0-9a-f-]/g, "");
      if (lid && !job.drive.briefUp && r.sub?.["01 Brief"]?.id) {
        const pf = await loadFile(`briefs/${lid}.pdf`);
        if (pf) {
          const u = await driveCall({ action: "upload", folder: r.sub["01 Brief"].id, name: `Brief-${job.client?.brand || "khach-hang"}.pdf`, type: "application/pdf", data: pf.toString("base64") }, 60000);
          if (u.ok) job.drive.briefUp = true;
        }
      }
      return json({ ok: true, job: await jobPut(job) });
    }

    case "drive_list": {
      needPost(); await requireAdmin(req, true);
      const job = findJob(await load<A[]>("jobs", []), String((await body(req)).id ?? ""));
      if (!job.drive?.id) fail("Dự án chưa có thư mục Drive.");
      const r = await driveOrFail({ action: "list", id: job.drive.id });
      return json({ ok: true, files: r.files ?? [] });
    }

    case "drive_upload": {
      needPost(); await requireAdmin(req, true);
      const b = await body(req, Math.floor(UPLOAD_MAX * 1.4 + 8192));
      const job = findJob(await load<A[]>("jobs", []), String(b.id ?? ""));
      const sub = String(b.sub ?? "");
      const fid = job.drive?.sub?.[sub]?.id ?? (sub === "" ? job.drive?.id ?? "" : "");
      if (!fid) fail("Chưa có thư mục Drive cho dự án này.");
      const data = String(b.data ?? "").replace(/^data:[^,]*,/, "");
      if (!data) fail("File không hợp lệ.");
      const r = await driveOrFail({ action: "upload", folder: fid, name: str(b.name || "file", 180), type: str(b.type, 100), data }, 120000);
      return json({ ok: true, file: { id: r.id ?? "", url: r.url ?? "", name: r.name ?? "" } });
    }

    case "drive_share": {
      needPost(); await requireAdmin(req, true);
      const b = await body(req);
      const job = findJob(await load<A[]>("jobs", []), String(b.id ?? ""));
      const sub = String(b.sub ?? "");
      const fid = job.drive?.sub?.[sub]?.id ?? "";
      if (!fid) fail("Chưa có thư mục này trên Drive.");
      const on = !!b.on;
      const r = await driveOrFail({ action: "share", id: fid, on });
      job.drive.shared = { ...(job.drive.shared ?? {}), [sub]: on };
      return json({ ok: true, url: r.url ?? "", job: await jobPut(job) });
    }

    case "company": {
      await requireAdmin(req, false);
      const c = await load<A>("company", {});
      return json({ ok: true, company: { ...COMPANY_DEF, ...c } });
    }

    case "company_save": {
      needPost(); await requireAdmin(req, true);
      const inp = (await body(req)).company;
      if (!inp || typeof inp !== "object") fail("Dữ liệu không hợp lệ.");
      const c: A = {};
      for (const k of Object.keys(COMPANY_DEF)) c[k] = str(inp[k], 200);
      await save("company", c);
      return json({ ok: true, company: c });
    }

    case "me": {
      const s = await readSession(req);
      const cfg = await load<A>("config", null);
      let csrf = s?.csrf ?? "";
      let cookie: Record<string, string> = {};
      if (!s) { const m = await makeCookieAnon(req); csrf = m.csrf; cookie = m.h; }
      return json({ ok: true, setup: cfg === null, logged: !!s, csrf }, 200, cookie);
    }

    case "setup": {
      needPost();
      if ((await load<A>("config", null)) !== null) fail("Mật khẩu đã được tạo. Hãy đăng nhập.", 409);
      const pw = String((await body(req)).password ?? "");
      if (pw.length < 8) fail("Mật khẩu cần ít nhất 8 ký tự.");
      await save("config", { hash: await bcrypt.hash(pw, 10), created: vn().iso });
      const c = await makeCookie(isSecure(req));
      return json({ ok: true, csrf: c.csrf }, 200, { "Set-Cookie": c.header });
    }

    case "login": {
      needPost();
      const cfg = await load<A>("config", null);
      if (cfg === null) fail("Chưa tạo mật khẩu.", 409);
      await throttleLogin(req);
      const pw = String((await body(req)).password ?? "");
      if (!(await bcrypt.compare(pw, cfg.hash || ""))) {
        await throttleLogin(req, true);
        await new Promise((r) => setTimeout(r, 400));
        fail("Sai mật khẩu.", 401);
      }
      const c = await makeCookie(isSecure(req));
      return json({ ok: true, csrf: c.csrf }, 200, { "Set-Cookie": c.header });
    }

    case "logout": {
      needPost();
      return json({ ok: true }, 200, { "Set-Cookie": clearCookie(isSecure(req)) });
    }

    case "password": {
      needPost(); await requireAdmin(req, true);
      const b = await body(req);
      const cfg = await load<A>("config", {});
      if (!(await bcrypt.compare(String(b.current ?? ""), cfg.hash || ""))) fail("Mật khẩu hiện tại không đúng.", 401);
      const next = String(b.next ?? "");
      if (next.length < 8) fail("Mật khẩu mới cần ít nhất 8 ký tự.");
      cfg.hash = await bcrypt.hash(next, 10); cfg.changed = vn().iso;
      await save("config", cfg);
      return json({ ok: true });
    }

    case "leads": {
      await requireAdmin(req, false);
      return json({ ok: true, leads: await load<A[]>("leads", []) });
    }

    case "lead_update": {
      needPost(); await requireAdmin(req, true);
      const b = await body(req), id = String(b.id ?? "");
      const lead = await mutate<A[], A>("leads", [], (L) => {
        const l = L.find((x) => x.id === id);
        if (!l) fail("Không tìm thấy khách hàng này.", 404);
        if (b.status !== undefined) { if (!["new", "contacted", "quoted", "won", "lost"].includes(b.status)) fail("Trạng thái không hợp lệ."); l.status = b.status; }
        if (b.adminNote !== undefined) l.adminNote = str(b.adminNote, 2000);
        l.updated = vn().iso;
        return l;
      });
      return json({ ok: true, lead });
    }

    case "lead_delete": {
      needPost(); await requireAdmin(req, true);
      const id = String((await body(req)).id ?? "");
      await mutate<A[], void>("leads", [], (L) => { const k = L.filter((l) => l.id !== id); L.length = 0; L.push(...k); });
      await deleteFile(`briefs/${id.replace(/[^0-9a-f-]/g, "")}.pdf`);
      return json({ ok: true });
    }

    case "leads_csv": {
      await requireAdmin(req, false);
      const L = await load<A[]>("leads", []);
      const cell = (v: unknown) => { const s = String(v ?? ""); const t = /^[=+\-@]/.test(s) ? "'" + s : s; return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
      const lines = [["Thời gian", "Mã báo giá", "Tên", "Thương hiệu", "Zalo", "Email", "Hạng mục", "Tạm tính", "Giảm", "Tổng", "Trạng thái", "Ghi chú khách", "Ghi chú nội bộ"].map(cell).join(",")];
      for (const l of L) {
        const items = (l.items ?? []).map((i: A) => i.name + (i.qty ? ` ×${i.qty}` : "")).join("; ");
        lines.push([l.time, l.quote ?? "", l.name, l.brand ?? "", l.zalo, l.email ?? "", items, l.subtotal, l.discount, l.total, l.status, l.note, l.adminNote ?? ""].map(cell).join(","));
      }
      return new Response("﻿" + lines.join("\r\n"), { headers: { ...H, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="khach-hang-${vn().iso.slice(0, 10)}.csv"` } });
    }

    case "content_save": {
      needPost(); await requireAdmin(req, true);
      const c = (await body(req)).content;
      if (!c || typeof c !== "object" || !c.site || !Array.isArray(c.packages)) fail("Nội dung không đúng cấu trúc.");
      for (const p of c.packages) {
        if (!p || !p.id || !p.name || !Array.isArray(p.items)) fail("Mỗi gói cần có mã, tên và danh sách hạng mục.");
        for (const it of p.items) if (!it.id || it.name === undefined || it.price === undefined || isNaN(Number(it.price))) fail(`Hạng mục "${it.name ?? "?"}" thiếu tên hoặc giá.`);
      }
      const old = await load<A>("content", null);
      if (old !== null) {
        const hist = await load<A[]>("content_history", []);
        hist.unshift({ time: vn().iso, content: old });
        await save("content_history", hist.slice(0, 10));
      }
      c.updated = vn().iso;
      await save("content", c);
      return json({ ok: true, updated: c.updated });
    }

    case "settings": {
      await requireAdmin(req, false);
      const ms = await mailSettings();
      ms.secret = ms.secret ? "••••" : "";
      return json({ ok: true, settings: ms });
    }

    case "settings_save": {
      needPost(); await requireAdmin(req, true);
      const b = await body(req);
      const emails: string[] = [];
      for (const m of String(b.emails ?? "").split(/[\s,;]+/)) {
        const t = m.trim(); if (!t) continue;
        if (!isEmail(t)) fail(`Email "${t}" chưa đúng.`);
        emails.push(t);
      }
      const old = await load<A>("settings", {});
      const hook = String(b.webhook ?? old.webhook ?? "").trim();
      if (hook && !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(hook)) fail("Địa chỉ Apps Script chưa đúng (dạng https://script.google.com/macros/s/…/exec).");
      let secret = String(b.secret ?? old.secret ?? "").trim();
      if (secret === "••••") secret = String(old.secret ?? "");
      const set = { emails: [...new Set(emails)].slice(0, 10), notify: !!b.notify, customer: !!b.customer, webhook: hook, secret };
      await save("settings", set);
      return json({ ok: true, settings: { ...set, secret: set.secret ? "••••" : "" } });
    }

    case "mail_test": {
      needPost(); await requireAdmin(req, true);
      const set = await mailSettings();
      const demo = { id: "TEST", quote: "BG-THU", time: vn().iso, name: "Khách thử", zalo: "0900000000", email: "", note: "Email gửi thử từ trang quản trị.",
        items: [{ pkg: "Nhận diện cốt lõi", name: "Thiết kế logo", qty: "", amount: 9000000 }], subtotal: 9000000, discount: 0, total: 9000000 };
      const c = await siteContent();
      let sent = 0;
      for (const to of set.emails as string[]) if (isEmail(to) && (await sendMail(to, "Thử email thông báo báo giá", quoteHtml(demo, c, false, host)))) sent++;
      if (!sent) fail("Chưa gửi được. Kiểm tra lại địa chỉ email và kết nối Apps Script.", 500);
      return json({ ok: true, sent });
    }

    case "content_history": {
      await requireAdmin(req, false);
      return json({ ok: true, history: (await load<A[]>("content_history", [])).map((h) => ({ time: h.time })) });
    }

    case "content_restore": {
      needPost(); await requireAdmin(req, true);
      const i = Number((await body(req)).index ?? -1);
      const hist = await load<A[]>("content_history", []);
      if (!hist[i]) fail("Không tìm thấy bản lưu này.", 404);
      await save("content", hist[i].content);
      return json({ ok: true, content: hist[i].content });
    }

    /* Nhập dữ liệu từ máy chủ cũ (trang /admin/import.html). Chỉ admin đã đăng nhập. */
    case "import": {
      needPost(); await requireAdmin(req, true);
      const b = await body(req, 4400000);
      const ok = ["content", "content_history", "jobs", "leads", "settings", "company", "config"];
      const done: string[] = [];
      for (const [name, text] of Object.entries<string>(b.files ?? {})) {
        if (!ok.includes(name)) continue;
        if (name === "config" && !b.withConfig) continue;
        const v = JSON.parse(String(text).replace(/^<\?php exit; \?>\s*/, ""));
        if (v !== null && v !== undefined) { await save(name, v); done.push(name); }
      }
      return json({ ok: true, imported: done });
    }

    case "import_pdf": {
      needPost(); await requireAdmin(req, true);
      const id = (url.searchParams.get("id") || "").replace(/[^0-9a-f-]/g, "");
      const raw = Buffer.from(await req.arrayBuffer());
      if (!id || raw.subarray(0, 4).toString() !== "%PDF") fail("File PDF không hợp lệ.");
      await saveFile(`briefs/${id}.pdf`, raw, "application/pdf");
      return json({ ok: true });
    }

    default:
      return fail("Không có chức năng này.", 404);
  }
}

function findJob(J: A[], id: string): A {
  const j = J.find((x) => x.id === id);
  return j ?? fail("Không tìm thấy dự án.", 404);
}
async function jobPut(job: A): Promise<A> {
  return mutate<A[], A>("jobs", [], (J) => {
    const i = J.findIndex((x) => x.id === job.id);
    if (i < 0) fail("Không tìm thấy dự án.", 404);
    job.updated = vn().iso; J[i] = job; return job;
  });
}
/** Trang admin cần mã CSRF ngay cả khi chưa đăng nhập: trả mã tạm, không cấp phiên. */
async function makeCookieAnon(req: Request) {
  void req;
  return { csrf: "", h: {} as Record<string, string> };
}

async function wrap(req: Request) {
  try {
    return await handle(req);
  } catch (e) {
    if (e instanceof Fail) return json({ ok: false, error: e.message }, e.code);
    console.error("nqk api", e);
    return json({ ok: false, error: "Lỗi máy chủ. Thử lại sau." }, 500);
  }
}
export const GET = wrap;
export const POST = wrap;
