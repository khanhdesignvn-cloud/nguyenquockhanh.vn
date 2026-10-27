import { NextResponse } from "next/server";
import defaults from "../../../../public/nqk-default.json";

// Thay thế tạm cho api.php cũ. Đọc nội dung mặc định; ghi dữ liệu (yêu cầu báo giá, /admin)
// sẽ nối kho dữ liệu ở bước sau, nên hiện trả lỗi rõ ràng thay vì nhận rồi mất.
const noStore = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const a = new URL(request.url).searchParams.get("a");
  if (a === "content") {
    return NextResponse.json({ ok: true, content: defaults }, { headers: noStore });
  }
  return NextResponse.json({ ok: false, error: "Chưa hỗ trợ" }, { status: 501, headers: noStore });
}

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Kho dữ liệu chưa được kết nối trên máy chủ mới." },
    { status: 503, headers: noStore },
  );
}
