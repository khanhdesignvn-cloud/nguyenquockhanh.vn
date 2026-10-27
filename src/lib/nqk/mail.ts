import { load } from "./store";
import defaults from "../../../public/nqk-default.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
type A = any;

export const e = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
const nl2br = (s: string) => e(s).replace(/\n/g, "<br>");
export const money = (n: number) => `${Math.round(n || 0).toLocaleString("de-DE")}đ`;
const dmy = (iso: string) =>
  new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function siteContent(): Promise<A> {
  const c = await load<A>("content", null);
  return c ?? defaults;
}
export async function mailSettings(): Promise<A> {
  const c = await siteContent();
  const def = { emails: [c?.site?.email].filter(Boolean), notify: true, customer: true };
  const s = await load<A>("settings", {});
  return { ...def, ...(s && typeof s === "object" ? s : {}) };
}

function dlines(t: string): string[] {
  const out: string[] = [];
  for (const p of t.split(/\s*[;\n]\s*/u).filter(Boolean)) {
    if (out.length && /^[A-Z0-9]{1,5}$/.test(p)) out[out.length - 1] += ", " + p;
    else out.push(p);
  }
  return out.map((x) => x.charAt(0).toUpperCase() + x.slice(1));
}

const SHELL = (inner: string) =>
  '<div style="background:#f5f4ef;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#1f1e1d"><div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e8e6dc;border-radius:14px;padding:24px">' +
  '<div style="height:4px;width:48px;background:#998EE0;background-image:linear-gradient(90deg,#EF9393,#E17DC2,#998EE0,#43ADD0,#8BDEDA);border-radius:4px;margin-bottom:14px"></div>' +
  inner +
  "</div></div>";

export function quoteHtml(l: A, c: A, forCustomer: boolean, host: string): string {
  const site = c?.site ?? {};
  let rows = "", i = 0, pkg: string | null = null;
  for (const it of l.items ?? []) {
    if ((it.pkg ?? "") !== pkg) {
      pkg = it.pkg ?? "";
      rows += `<tr><td colspan="3" style="padding:12px 0 4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8a877e">${e(pkg)}</td></tr>`;
    }
    i++;
    rows +=
      `<tr><td style="padding:7px 0;border-bottom:1px solid #eeece6;color:#998EE0;font-weight:700;width:28px;vertical-align:top">${String(i).padStart(2, "0")}</td>` +
      `<td style="padding:7px 0;border-bottom:1px solid #eeece6">${e(it.name)}` +
      (it.qty ? ` <span style="color:#8a877e">× ${e(it.qty)}</span>` : "") +
      (it.desc ? `<div style="font-size:12px;color:#8a877e;margin-top:3px;padding-left:10px;border-left:1px solid #e8e6dc">${dlines(String(it.desc)).map(e).join("<br>")}</div>` : "") +
      (it.skip ? `<div style="font-size:12px;color:#b7b5a9;margin-top:3px">Không cần: ${e(it.skip)}</div>` : "") +
      (it.note ? `<div style="font-size:12.5px;margin-top:4px;padding:6px 8px;background:#f3f1fb;border-radius:6px;color:#3d3a52"><b>Góp ý:</b> ${nl2br(it.note)}</div>` : "") +
      `</td><td style="padding:7px 0;border-bottom:1px solid #eeece6;text-align:right;white-space:nowrap;vertical-align:top">${money(+it.amount)}</td></tr>`;
  }
  if (!rows) rows = '<tr><td colspan="3" style="padding:10px 0;color:#8a877e">Khách chưa chọn hạng mục, cần tư vấn gói phù hợp.</td></tr>';
  let tot = `<tr><td colspan="2" style="padding:10px 0 2px;color:#8a877e">Tạm tính</td><td style="text-align:right">${money(+l.subtotal)}</td></tr>`;
  if (+l.discount > 0) tot += `<tr><td colspan="2" style="padding:2px 0;color:#8a877e">Ưu đãi</td><td style="text-align:right">−${money(+l.discount)}</td></tr>`;
  tot += `<tr><td colspan="2" style="padding:8px 0;font-weight:700;border-top:2px solid #1f1e1d">Tổng cộng</td><td style="padding:8px 0;text-align:right;font-weight:700;font-size:18px;border-top:2px solid #1f1e1d">${money(+l.total)}</td></tr>`;
  const intro = forCustomer
    ? `<p>Chào ${e(l.name)},</p><p>Cảm ơn bạn đã quan tâm. Dưới đây là báo giá tạm tính bạn vừa chọn trên nguyenquockhanh.vn. Khánh sẽ nhắn Zalo cho bạn trong vòng 24 giờ để trao đổi brief.</p>`
    : `<p><b>Có yêu cầu báo giá mới.</b></p><p>Tên: <b>${e(l.name)}</b>` +
      (l.brand ? `<br>Thương hiệu: <b>${e(l.brand)}</b>` : "") +
      `<br>Zalo: <a href="https://zalo.me/${e(String(l.zalo).replace(/\D/g, ""))}">${e(l.zalo)}</a>` +
      (l.email ? `<br>Email: ${e(l.email)}` : "") +
      (l.note ? `<br>Ghi chú: ${nl2br(l.note)}` : "") + "</p>";
  const foot = forCustomer
    ? `<p style="color:#8a877e;font-size:12px">${e(site.terms ?? "")}</p><p style="font-size:13px">Nguyễn Quốc Khánh · Zalo ${e(site.phone ?? "")} · ${e(site.email ?? "")}</p>`
    : `<p style="font-size:13px"><a href="https://${e(host)}/admin/">Mở trang quản trị</a></p>`;
  return SHELL(
    `<div style="font-size:12px;color:#8a877e">BÁO GIÁ DỊCH VỤ · TƯ VẤN & THIẾT KẾ THƯƠNG HIỆU · ${e(l.quote || l.id)} · ${dmy(l.time)}</div>` +
      intro + `<table style="width:100%;border-collapse:collapse;font-size:14px">${rows}${tot}</table>` + foot,
  );
}

export function briefHtml(l: A, forCustomer: boolean, host: string): string {
  let rows = "";
  for (const [k, v] of l.brief ?? [])
    rows += `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #eeece6;color:#8a877e;width:36%;vertical-align:top;font-size:13px">${e(k)}</td><td style="padding:8px 0;border-bottom:1px solid #eeece6;font-size:14px">${nl2br(v)}</td></tr>`;
  const digits = String(l.zalo).replace(/\D/g, "");
  const intro = forCustomer
    ? `<p>Chào ${e(l.name)},</p><p>Cảm ơn bạn đã gửi brief cho <b>${e(l.brand)}</b>. Khánh sẽ liên hệ trong vòng 24 giờ. File PDF brief được đính kèm trong email này.</p>`
    : `<p><b>Có brief thiết kế mới.</b> File PDF đính kèm.</p><p><a href="https://zalo.me/${e(digits)}" style="display:inline-block;background:#998EE0;color:#fff;text-decoration:none;padding:8px 14px;border-radius:20px;font-size:13px">Nhắn Zalo ${e(l.zalo)}</a></p>`;
  const foot = forCustomer
    ? '<p style="font-size:13px">Nguyễn Quốc Khánh · Zalo 0988 886 901 · khanhdesignvn@gmail.com</p>'
    : `<p style="font-size:13px"><a href="https://${e(host)}/admin/">Mở trang quản trị</a></p>`;
  return SHELL(
    `<div style="font-size:12px;color:#8a877e">BRIEF THIẾT KẾ · ${e(l.quote)} · ${dmy(l.time)}</div>` + intro + `<table style="width:100%;border-collapse:collapse">${rows}</table>` + foot,
  );
}

/** Gửi qua Google Apps Script (Gmail của Khánh). */
export async function sendMail(to: string, subject: string, html: string, replyTo = "", files: A[] = []): Promise<boolean> {
  const set = await load<A>("settings", {});
  const hook = String(set.webhook ?? ""), secret = String(set.secret ?? "");
  if (!hook || !secret) return false;
  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, to: [to], subject, html, replyTo: isEmail(replyTo) ? replyTo : "", name: "Nguyễn Quốc Khánh", attachments: files }),
      redirect: "follow",
      signal: AbortSignal.timeout(40000),
    });
    const j = await res.json().catch(() => null);
    return !!(j && j.ok);
  } catch {
    return false;
  }
}

export async function driveCall(data: A, timeout = 60000): Promise<{ ok: boolean; j?: A; err?: string }> {
  const set = await load<A>("settings", {});
  const hook = String(set.webhook ?? ""), secret = String(set.secret ?? "");
  if (!hook || !secret) return { ok: false, err: "Chưa cài đặt kết nối Google (Apps Script) trong tab Tài khoản." };
  try {
    const res = await fetch(hook, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, ...data }), redirect: "follow", signal: AbortSignal.timeout(timeout),
    });
    const j = await res.json().catch(() => null);
    if (!j) return { ok: false, err: "Không kết nối được Google Drive." };
    return { ok: !!j.ok, j, err: j.error };
  } catch (x) {
    return { ok: false, err: "Không kết nối được Google Drive (" + (x as Error).message + ")." };
  }
}

export async function notifyLead(l: A, host: string): Promise<void> {
  const set = await mailSettings(), c = await siteContent();
  const code = l.quote || l.id;
  const tasks: Promise<unknown>[] = [];
  if (set.notify)
    for (const to of set.emails as string[]) if (isEmail(String(to).trim()))
      tasks.push(sendMail(String(to).trim(), `Báo giá mới ${code} · ${l.name}${l.brand ? ` (${l.brand})` : ""} · ${money(+l.total)}`, quoteHtml(l, c, false, host), l.email ?? ""));
  if (set.customer && l.email) {
    const reply = (set.emails as string[]).map((x) => String(x).trim()).find(isEmail) ?? "";
    tasks.push(sendMail(l.email, `Báo giá tạm tính ${code} · Nguyễn Quốc Khánh`, quoteHtml(l, c, true, host), reply));
  }
  await Promise.all(tasks);
}

export async function notifyBrief(l: A, pdf: Buffer | null, host: string): Promise<boolean> {
  const set = await mailSettings();
  const files = pdf ? [{ name: `Brief-${String(l.quote).replace(/[^A-Za-z0-9-]/g, "")}.pdf`, type: "application/pdf", data: pdf.toString("base64") }] : [];
  let sent = false;
  const jobs: Promise<unknown>[] = [];
  for (const to of set.emails as string[]) {
    const t = String(to).trim();
    if (isEmail(t)) jobs.push(sendMail(t, `Brief mới ${l.quote} · ${l.brand} · ${l.name}`, briefHtml(l, false, host), l.email ?? "", files).then((ok) => { if (ok) sent = true; }));
  }
  if (set.customer && l.email) {
    const reply = (set.emails as string[]).map((x) => String(x).trim()).find(isEmail) ?? "";
    jobs.push(sendMail(l.email, `Brief thiết kế ${l.brand} · Nguyễn Quốc Khánh`, briefHtml(l, true, host), reply, files));
  }
  await Promise.all(jobs);
  return sent;
}
