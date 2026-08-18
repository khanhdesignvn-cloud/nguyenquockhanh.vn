import Link from "next/link";
import IconLink from "@/components/ui/IconLink";

export default function Footer() {
  return (
    <footer className="border-t border-ink-800/80 bg-ink-950">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              Nguyễn Quốc <span className="text-gradient">Khánh</span>
            </span>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist-400">
              Chuyên gia nhận diện thương hiệu. Chia sẻ kiến thức, kinh nghiệm thực chiến qua
              khóa học và podcast — giúp cá nhân và doanh nghiệp xây dựng thương hiệu có bản sắc.
            </p>
            <div className="mt-5 flex gap-3">
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
              <IconLink href="#" label="Spotify">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.7.7 0 0 1-1 .2c-2.6-1.6-5.9-2-9.8-1a.7.7 0 1 1-.4-1.4c4.2-1 7.9-.6 10.9 1.2.3.2.4.7.3 1Zm1.2-2.8a.9.9 0 0 1-1.2.3c-3-1.8-7.5-2.4-11-1.3a.9.9 0 1 1-.5-1.7c4-1.2 9-.6 12.4 1.5a.9.9 0 0 1 .3 1.2Zm.1-2.9C14.6 8.6 9 8.4 5.7 9.5a1 1 0 1 1-.6-2c3.8-1.2 10-1 13.7 1.2a1 1 0 1 1-1 1.8Z" />
                </svg>
              </IconLink>
            </div>
          </div>

          <FooterColumn
            title="Khám phá"
            links={[
              { href: "/khoa-hoc", label: "Khóa học" },
              { href: "/podcast", label: "Podcast" },
              { href: "/kien-thuc", label: "Kiến thức" },
            ]}
          />
          <FooterColumn
            title="Về Khánh"
            links={[
              { href: "/gioi-thieu", label: "Giới thiệu" },
              { href: "/lien-he", label: "Liên hệ" },
            ]}
          />
          <FooterColumn
            title="Liên hệ"
            links={[
              { href: "mailto:hello@nguyenquockhanh.vn", label: "hello@nguyenquockhanh.vn" },
              { href: "tel:+84900000000", label: "+84 90 000 0000" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ink-800/80 pt-6 text-xs text-mist-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nguyễn Quốc Khánh. Bảo lưu mọi quyền.</p>
          <p>Thiết kế &amp; xây dựng bởi Nguyễn Quốc Khánh</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-mist-400 hover:text-gold-300">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
