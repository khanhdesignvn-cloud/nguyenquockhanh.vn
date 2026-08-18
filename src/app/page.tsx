import Link from "next/link";
import Button from "@/components/ui/Button";
import CourseCard from "@/components/course/CourseCard";
import EpisodeCard from "@/components/podcast/EpisodeCard";
import ArticleCard from "@/components/article/ArticleCard";
import { articles, courses, episodes } from "@/lib/data";

const stats = [
  { value: "8+", label: "năm tư vấn thương hiệu" },
  { value: "120+", label: "dự án nhận diện đã triển khai" },
  { value: "3.000+", label: "học viên đã tham gia khóa học" },
  { value: "12", label: "tập podcast đã phát hành" },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-900/60 px-4 py-1.5 text-xs font-medium text-mist-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              Chuyên gia Nhận diện Thương hiệu
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Xây thương hiệu <span className="text-gradient">có bản sắc</span>,
              <br />
              không chỉ có hình thức
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-mist-400 sm:text-lg">
              Tôi là Nguyễn Quốc Khánh — đồng hành cùng cá nhân và doanh nghiệp xây dựng nhận diện
              thương hiệu có chiến lược, thông qua khóa học thực chiến, podcast hàng tuần và kiến
              thức chuyên sâu được đúc kết từ hơn 8 năm làm nghề.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button href="/khoa-hoc">Khám phá khóa học</Button>
              <Button href="/podcast" variant="ghost">
                Nghe podcast mới nhất
              </Button>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div
              className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-gold-500/25 via-violet-500/15 to-transparent blur-2xl"
              aria-hidden="true"
            />
            <div className="card-surface relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2.5rem]">
              <span className="text-8xl font-extrabold text-ink-700 select-none">NQK</span>
            </div>
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-6 border-y border-ink-800 py-10 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-extrabold text-gradient">{stat.value}</dd>
              <p className="mt-1 text-sm text-mist-400">{stat.label}</p>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Khóa học"
          title="Học để xây thương hiệu đúng ngay từ đầu"
          href="/khoa-hoc"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Podcast"
          title="Câu chuyện thương hiệu, kể mỗi tuần"
          href="/podcast"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {episodes.slice(0, 4).map((episode) => (
            <EpisodeCard key={episode.slug} episode={episode} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow="Kiến thức"
          title="Góc nhìn chuyên sâu về nhận diện thương hiệu"
          href="/kien-thuc"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="glow-interactive glow-gold card-surface flex flex-col items-center gap-6 rounded-[2rem] px-8 py-14 text-center">
          <h2 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
            Sẵn sàng xây dựng thương hiệu <span className="text-gradient">của riêng bạn</span>?
          </h2>
          <p className="max-w-xl text-mist-400">
            Bắt đầu với khóa học nền tảng, hoặc liên hệ trực tiếp để được tư vấn lộ trình phù hợp
            với mục tiêu của bạn.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/khoa-hoc">Bắt đầu học ngay</Button>
            <Button href="/lien-he" variant="ghost">
              Liên hệ tư vấn
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
          {eyebrow}
        </span>
        <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">{title}</h2>
      </div>
      <Link
        href={href}
        className="glow-interactive glow-violet rounded-full border border-ink-600 px-5 py-2 text-sm font-medium text-mist-300 hover:text-foreground"
      >
        Xem tất cả →
      </Link>
    </div>
  );
}
