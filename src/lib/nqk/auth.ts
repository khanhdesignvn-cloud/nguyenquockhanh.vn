import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { load, save } from "./store";

/** Phiên đăng nhập: cookie ký HMAC (không cần lưu phiên). Khoá ký lưu trong kho dữ liệu. */
const COOKIE = "nqk_admin";
const TTL = 60 * 60 * 12;

let cachedKey: string | null = null;
async function key(): Promise<string> {
  if (cachedKey) return cachedKey;
  const s = await load<{ k?: string }>("secret", {});
  if (s.k) return (cachedKey = s.k);
  const k = randomBytes(32).toString("hex");
  await save("secret", { k });
  const again = await load<{ k?: string }>("secret", {});
  return (cachedKey = again.k || k);
}
const sign = (payload: string, k: string) => createHmac("sha256", k).update(payload).digest("base64url");

export type Session = { uid: string; at: number; csrf: string };

export async function makeCookie(secure: boolean): Promise<{ header: string; csrf: string }> {
  const csrf = randomBytes(16).toString("hex");
  const s: Session = { uid: "admin", at: Math.floor(Date.now() / 1000), csrf };
  const p = Buffer.from(JSON.stringify(s)).toString("base64url");
  const v = `${p}.${sign(p, await key())}`;
  return { header: `${COOKIE}=${v}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TTL}${secure ? "; Secure" : ""}`, csrf };
}
export const clearCookie = (secure: boolean) => `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`;

export async function readSession(req: Request): Promise<Session | null> {
  const m = (req.headers.get("cookie") || "").match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return null;
  const [p, sig] = m[1].split(".");
  if (!p || !sig) return null;
  const good = sign(p, await key());
  const a = Buffer.from(sig), b = Buffer.from(good);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const s = JSON.parse(Buffer.from(p, "base64url").toString("utf8")) as Session;
    if (Math.floor(Date.now() / 1000) - s.at > TTL) return null;
    return s;
  } catch {
    return null;
  }
}
