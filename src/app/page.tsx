import type { Metadata } from "next";
import Link from "next/link";
import "./home.css";
import { activities, goals, journey, projects, services, stats, steps, team, values } from "./home-data";

export const metadata: Metadata = {
  title: { absolute: "Nguyễn Quốc Khánh – Người kể chuyện thương hiệu" },
  description:
    "Kiến trúc sư theo đào tạo, hơn 10 năm thiết kế nhận diện thương hiệu, sáng lập Horus Agency tại Đà Nẵng. Tư vấn thương hiệu, logo, bao bì, website.",
  alternates: { canonical: "/" },
};

const nav = [
  { href: "#gioi-thieu", label: "Giới thiệu" },
  { href: "#dich-vu", label: "Dịch vụ" },
  { href: "#du-an", label: "Dự án" },
  { href: "#doi-ngu", label: "Đội ngũ" },
  { href: "#lien-he", label: "Liên hệ" },
];
const n2 = (i: number) => String(i + 1).padStart(2, "0");

export default function HomePage() {
  return (
    <div className="hp">
      <header className="hp-top">
        <div className="hp-wrap hp-top-in">
          <a href="#" className="hp-brand">Nguyễn Quốc Khánh</a>
          <nav className="hp-nav">
            {nav.map((x) => <a key={x.href} href={x.href}>{x.label}</a>)}
          </nav>
          <Link href="/bao-gia" className="hp-btn hp-btn-sm">Nhận báo giá</Link>
          <details className="hp-menu">
            <summary aria-label="Mở menu"><span /><span /></summary>
            <div>
              {nav.map((x) => <a key={x.href} href={x.href}>{x.label}</a>)}
              <Link href="/bao-gia">Nhận báo giá</Link>
            </div>
          </details>
        </div>
      </header>

      <main>
        {/* Bìa */}
        <section className="hp-cream hp-hero">
          <div className="hp-lines" aria-hidden="true" />
          <div className="hp-wrap hp-hero-in">
            <div className="hp-lab">Hồ sơ năng lực · 2026</div>
            <h1 className="hp-big hp-hero-t">Người kể chuyện<br />thương hiệu</h1>
            <div className="hp-rule-gold" />
            <div className="hp-hero-name">Nguyễn Quốc Khánh</div>
            <p className="hp-body hp-mute">Giám đốc sáng tạo Horus Agency · Đà Nẵng</p>
            <div className="hp-cta">
              <Link href="/bao-gia" className="hp-btn">Nhận báo giá thiết kế</Link>
              <a href="#du-an" className="hp-btn hp-btn-ghost">Xem dự án</a>
            </div>
            <dl className="hp-hero-contact">
              <div><dt className="hp-lab">Zalo</dt><dd><a href="https://zalo.me/0988886901">0988 886 901</a></dd></div>
              <div><dt className="hp-lab">Email</dt><dd><a href="mailto:khanhdesignvn@gmail.com">khanhdesignvn@gmail.com</a></dd></div>
              <div><dt className="hp-lab">Địa chỉ</dt><dd>Đà Nẵng, Việt Nam</dd></div>
            </dl>
          </div>
          <div className="hp-tab" aria-hidden="true">Brand storyteller</div>
        </section>

        {/* Giới thiệu */}
        <section id="gioi-thieu" className="hp-cream hp-about">
          <div className="hp-wrap hp-about-in">
            <div className="hp-about-txt">
              <div className="hp-lab">01 — Giới thiệu</div>
              <h2 className="hp-big hp-h2">Nguyễn Quốc<br />Khánh</h2>
              <div className="hp-lab hp-mute">Giám đốc sáng tạo · Horus Agency</div>
              <p className="hp-body">
                Kiến trúc sư theo đào tạo, hơn 10 năm làm thiết kế nhận diện thương hiệu. Anh sáng lập Horus Agency tại Đà Nẵng (2019), đồng hành cùng hàng trăm thương hiệu Việt trong việc kể câu chuyện của mình bằng logo, bao bì, website và hệ thống nhận diện nhất quán.
              </p>
              <p className="hp-body">
                Bên cạnh nghề thiết kế, Khánh là giảng viên thỉnh giảng, người xây dựng các khoá học cho sinh viên, chủ doanh nghiệp và người làm marketing, và là Top Rated Seller trên Fiverr.
              </p>
              <dl className="hp-stats">
                {stats.map((s) => <div key={s.v}><dt>{s.v}</dt><dd>{s.l}</dd></div>)}
              </dl>
            </div>
            <div className="hp-portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home/khanh.webp" alt="Nguyễn Quốc Khánh" width={600} height={575} />
            </div>
          </div>
        </section>

        {/* Tầm nhìn & sứ mệnh */}
        <section className="hp-vm">
          <div className="hp-dark hp-vm-c">
            <div className="hp-lines" aria-hidden="true" />
            <h2 className="hp-big hp-h3 hp-gold">Tầm nhìn</h2>
            <p className="hp-lead">Trở thành người kể chuyện thương hiệu đáng tin cậy của doanh nghiệp Việt: giúp mỗi thương hiệu có một bản sắc riêng, được nhớ đến và đi được đường dài.</p>
          </div>
          <div className="hp-goldbg hp-vm-c">
            <h2 className="hp-big hp-h3">Sứ mệnh</h2>
            <p className="hp-lead">Biến câu chuyện của khách hàng thành logo và hệ thống nhận diện độc đáo, nhất quán; đồng thời truyền nghề và chia sẻ kinh nghiệm cho thế hệ nhà thiết kế, chủ doanh nghiệp trẻ.</p>
            <p className="hp-body">Cam kết sáng tạo không ngừng, chất lượng cao cấp và tận tâm tuyệt đối với mọi dự án.</p>
          </div>
        </section>

        {/* Giá trị */}
        <section className="hp-dark hp-sec">
          <div className="hp-wrap">
            <div className="hp-lab">Giá trị cốt lõi</div>
            <div className="hp-grid4 hp-values">
              {values.map((v) => <div key={v.t}><h3>{v.t}</h3><p className="hp-body">{v.d}</p></div>)}
            </div>
          </div>
        </section>

        {/* Hành trình */}
        <section className="hp-cream hp-sec">
          <div className="hp-wrap hp-split">
            <div>
              <div className="hp-lab">01 — Giới thiệu</div>
              <h2 className="hp-big hp-h2">Hành<br />trình</h2>
              <p className="hp-body hp-mute">Từ kiến trúc đến nhận diện thương hiệu, từ hành nghề đến giảng dạy.</p>
            </div>
            <ol className="hp-journey">
              {journey.map((j) => <li key={j.y + j.t}><span className="hp-lab">{j.y}</span><b>{j.t}</b><span className="hp-mute">{j.s}</span></li>)}
            </ol>
          </div>
        </section>

        {/* Dịch vụ */}
        <section id="dich-vu" className="hp-cream hp-sec hp-bt">
          <div className="hp-wrap">
            <div className="hp-head">
              <h2 className="hp-big hp-h2">Dịch<br />vụ</h2>
              <div className="hp-lab">02 — Dịch vụ &amp; mục tiêu</div>
            </div>
            <div className="hp-grid2 hp-svc">
              {services.map((s, i) => <div key={s.t}><span className="hp-num">{n2(i)}</span><h3>{s.t}</h3><p className="hp-body">{s.d}</p></div>)}
            </div>
            <div className="hp-cta"><Link href="/bao-gia" className="hp-btn">Chọn gói &amp; xem báo giá</Link></div>
          </div>
        </section>

        {/* Mục tiêu */}
        <section className="hp-dark hp-sec">
          <div className="hp-lines" aria-hidden="true" />
          <div className="hp-wrap">
            <div className="hp-lab">02 — Dịch vụ &amp; mục tiêu</div>
            <h2 className="hp-big hp-h3">Mục tiêu dự án<br />nhận diện thương hiệu</h2>
            <div className="hp-grid4 hp-goals">
              {goals.map((g, i) => <div key={g.t}><span className="hp-gnum">{n2(i)}</span><h3>{g.t}</h3><p className="hp-body">{g.d}</p></div>)}
            </div>
          </div>
        </section>

        {/* Quy trình */}
        <section className="hp-dark hp-sec hp-bt-dk">
          <div className="hp-wrap">
            <h2 className="hp-big hp-h3">Quy trình</h2>
            <ol className="hp-steps">
              {steps.map((s, i) => <li key={s.t}><span className="hp-lab">{n2(i)}</span><i aria-hidden="true" /><h3>{s.t}</h3><p className="hp-body">{s.d}</p></li>)}
            </ol>
          </div>
        </section>

        {/* Dự án */}
        <section id="du-an" className="hp-cream hp-sec">
          <div className="hp-wrap">
            <div className="hp-head">
              <h2 className="hp-big hp-h2">Dự án<br />tiêu biểu</h2>
              <div className="hp-lab">03 — Dự án tiêu biểu</div>
            </div>
            <div className="hp-projects">
              {projects.map((p, i) => (
                <article key={p.k} className="hp-proj">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/home/${p.k}.webp`} alt={`Nhận diện thương hiệu ${p.n}`} width={2400} height={570} loading="lazy" />
                  <div className="hp-cap">
                    <h3><i>{n2(i)}</i>{p.n}</h3>
                    <dl className="hp-meta">
                      <div><dt>Lĩnh vực</dt><dd>{p.f}</dd></div>
                      <div><dt>Hạng mục</dt><dd>Nhận diện thương hiệu</dd></div>
                      <div><dt>Năm</dt><dd>{p.y}</dd></div>
                    </dl>
                    <p className="hp-body">{p.d}</p>
                    <div className="hp-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Đội ngũ */}
        <section id="doi-ngu" className="hp-cream hp-team">
          <div className="hp-team-img">
            <p>Meet our team of creative warriors, ready to harness the disturbed you.</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/home/team.webp" alt="Đội ngũ Horus Agency" width={1600} height={990} loading="lazy" />
          </div>
          <div className="hp-team-list">
            <div className="hp-lab">04 — Đội ngũ &amp; hoạt động</div>
            <h2 className="hp-big hp-h3">Đội ngũ</h2>
            <ul>
              {team.map((m) => (
                <li key={m.k}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/home/${m.k}.webp`} alt="" width={52} height={52} loading="lazy" />
                  <div><b>{m.n}</b><span className="hp-lab hp-mute">{m.r}</span></div>
                </li>
              ))}
            </ul>
            <p className="hp-body hp-mute">…và nhiều cá nhân xuất sắc khác.</p>
          </div>
        </section>

        {/* Hoạt động */}
        <section className="hp-dark hp-sec">
          <div className="hp-wrap">
            <div className="hp-lab">04 — Đội ngũ &amp; hoạt động</div>
            <h2 className="hp-big hp-h3">Hoạt động &amp; truyền thông</h2>
            <div className="hp-grid4 hp-acts">
              {activities.map((a) => (
                <article key={a.k}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/home/${a.k}.webp`} alt={a.t} loading="lazy" />
                  <h3>{a.t}</h3>
                  <div className="hp-lab hp-mutedk">{a.w}</div>
                  <p className="hp-body">{a.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Liên hệ */}
        <section id="lien-he" className="hp-dark hp-contact">
          <div className="hp-lines" aria-hidden="true" />
          <div className="hp-wrap hp-contact-in">
            <div>
              <div className="hp-lab">05 — Liên hệ</div>
              <h2 className="hp-big hp-gold hp-contact-t">Cùng kể<br />câu chuyện</h2>
              <p className="hp-lead">Mỗi thương hiệu đều có một câu chuyện đáng được kể. Hãy cùng nhau kể câu chuyện của bạn.</p>
              <div className="hp-cta">
                <Link href="/bao-gia" className="hp-btn hp-btn-gold">Nhận báo giá</Link>
                <a href="https://zalo.me/0988886901" className="hp-btn hp-btn-ghost-dk">Nhắn Zalo</a>
              </div>
              <dl className="hp-hero-contact hp-contact-dl">
                <div><dt className="hp-lab">Zalo</dt><dd><a href="https://zalo.me/0988886901">0988 886 901</a></dd></div>
                <div><dt className="hp-lab">Email</dt><dd><a href="mailto:khanhdesignvn@gmail.com">khanhdesignvn@gmail.com</a></dd></div>
                <div><dt className="hp-lab">Địa chỉ</dt><dd>Đà Nẵng, Việt Nam</dd></div>
              </dl>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hp-contact-img" src="/home/press_portrait.webp" alt="Nguyễn Quốc Khánh" width={809} height={714} loading="lazy" />
          </div>
        </section>
      </main>

      <footer className="hp-dark hp-foot">
        <div className="hp-wrap hp-foot-in">
          <span>© {new Date().getFullYear()} Nguyễn Quốc Khánh · Người kể chuyện thương hiệu</span>
          <nav>
            <Link href="/bao-gia">Báo giá</Link>
            <Link href="/khoa-hoc">Khoá học</Link>
            <Link href="/branding">Branding</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
