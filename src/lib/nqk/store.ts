import { get, put, del, BlobPreconditionFailedError } from "@vercel/blob";

/** Kho dữ liệu JSON trên Vercel Blob (private). Thay cho thư mục nqk-data/ của api.php cũ. */
const PREFIX = "nqk/";

async function readRaw(pathname: string): Promise<{ buf: Buffer; etag: string } | null> {
  const r = await get(pathname, { access: "private", useCache: false });
  if (!r || r.statusCode !== 200 || !r.stream) return null;
  const buf = Buffer.from(await new Response(r.stream).arrayBuffer());
  return { buf, etag: r.blob.etag };
}

export async function load<T>(name: string, def: T): Promise<T> {
  return (await loadWithEtag<T>(name, def)).data;
}

export async function loadWithEtag<T>(name: string, def: T): Promise<{ data: T; etag?: string }> {
  try {
    const r = await readRaw(`${PREFIX}${name}.json`);
    if (!r) return { data: def };
    const v = JSON.parse(r.buf.toString("utf8"));
    return { data: v === null ? def : (v as T), etag: r.etag };
  } catch {
    return { data: def };
  }
}

export async function save(name: string, value: unknown, etag?: string): Promise<void> {
  await put(`${PREFIX}${name}.json`, JSON.stringify(value), {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60,
    ...(etag ? { ifMatch: etag } : {}),
  });
}

/** Đọc - sửa - ghi, thử lại khi hai yêu cầu cùng lúc (ETag không khớp). */
export async function mutate<T, R>(name: string, def: T, fn: (data: T) => R | Promise<R>): Promise<R> {
  for (let i = 0; i < 6; i++) {
    const { data, etag } = await loadWithEtag<T>(name, def);
    const res = await fn(data);
    try {
      await save(name, data, etag);
      return res;
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError) {
        await new Promise((r) => setTimeout(r, 80 + Math.random() * 160));
        continue;
      }
      throw e;
    }
  }
  throw new Error("Kho dữ liệu đang bận, thử lại sau.");
}

export async function saveFile(name: string, buf: Buffer, contentType: string): Promise<void> {
  await put(`${PREFIX}files/${name}`, buf, { access: "private", allowOverwrite: true, addRandomSuffix: false, contentType });
}
export async function loadFile(name: string): Promise<Buffer | null> {
  try {
    const r = await readRaw(`${PREFIX}files/${name}`);
    return r ? r.buf : null;
  } catch {
    return null;
  }
}
export async function deleteFile(name: string): Promise<void> {
  try {
    await del(`${PREFIX}files/${name}`);
  } catch {}
}
