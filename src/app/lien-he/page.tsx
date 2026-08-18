import type { Metadata } from "next";
import IconLink from "@/components/ui/IconLink";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ tư vấn khóa học và dự án nhận diện thương hiệu với Nguyễn Quốc Khánh.",
};

const contactInfo = [
  { label: "Email", value: "hello@nguyenquockhanh.vn", href: "mailto:hello@nguyenquockhanh.vn" },
  { label: "Điện thoại", value: "+84 90 000 0000", href: "tel:+84900000000" },
  { label: "Khu vực làm việc", value: "TP. Hồ Chí Minh, Việt Nam", href: undefined },
];

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
          Liên hệ
        </span>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Cùng trao đổi về thương hiệu</h1>
        <p className="mt-4 text-mist-400">
          Điền thông tin bên dưới, mình sẽ phản hồi trong vòng 24 giờ làm việc để tư vấn khóa học
          hoặc dự án phù hợp với bạn.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          {contactInfo.map((item) => (
            <div key={item.label} className="card-surface rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wide text-mist-500">{item.label}</p>
              {item.href ? (
                <a href={item.href} className="mt-1 block font-semibold text-foreground hover:text-gold-300">
                  {item.value}
                </a>
              ) : (
                <p className="mt-1 font-semibold text-foreground">{item.value}</p>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <IconLink href="#" label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 21v-7.5H16l.5-3.2h-3V8.2c0-.93.3-1.56 1.65-1.56H16.6V3.86A22 22 0 0 0 14.3 3.7c-2.28 0-3.84 1.39-3.84 3.94v2.66H8v3.2h2.46V21h3.04Z" />
              </svg>
            </IconLink>
            <IconLink href="#" label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.6 7.6a2.9 2.9 0 0 0-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.6a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2 12a30 30 0 0 0 .4 4.4 2.9 2.9 0 0 0 2 2C6.1 19 12 19 12 19s5.9 0 7.6-.6a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22 12a30 30 0 0 0-.4-4.4ZM10 15.2V8.8L15.5 12Z" />
              </svg>
            </IconLink>
          </div>
        </div>

        <form className="card-surface flex flex-col gap-5 rounded-2xl p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Họ và tên" name="name" placeholder="Nguyễn Văn A" />
            <Field label="Email" name="email" type="email" placeholder="ban@email.com" />
          </div>
          <Field label="Chủ đề quan tâm" name="topic" placeholder="Khóa học / Tư vấn dự án..." />
          <div>
            <label htmlFor="message" className="text-sm font-medium text-mist-300">
              Nội dung
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Chia sẻ mục tiêu hoặc câu hỏi của bạn..."
              className="glow-interactive glow-gold mt-2 w-full resize-none rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-sm text-foreground placeholder:text-mist-500 focus:border-gold-400/60 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="glow-interactive glow-gold mt-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3 text-sm font-semibold text-ink-950 hover:from-gold-300 hover:to-gold-400"
          >
            Gửi liên hệ
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-mist-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="glow-interactive glow-gold mt-2 w-full rounded-xl border border-ink-600 bg-ink-900/60 px-4 py-3 text-sm text-foreground placeholder:text-mist-500 focus:border-gold-400/60 focus:outline-none"
      />
    </div>
  );
}
