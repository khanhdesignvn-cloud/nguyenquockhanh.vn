import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import CourseCard from "@/components/course/CourseCard";
import { courses, formatVnd } from "@/lib/data";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

async function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  return { title: course.title, description: course.tagline };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const related = courses.filter((c) => c.slug !== course.slug).slice(0, 2);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/khoa-hoc" className="text-sm text-mist-400 hover:text-gold-300">
        ← Tất cả khóa học
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="w-fit rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-300">
            {course.level}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{course.title}</h1>
          <p className="mt-3 text-lg text-mist-400">{course.tagline}</p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-mist-500">
            <span>{course.duration}</span>
            <span aria-hidden="true">•</span>
            <span>{course.lessons} bài học</span>
            <span aria-hidden="true">•</span>
            <span>Truy cập trọn đời</span>
          </div>

          <div className="card-surface mt-10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-foreground">Giới thiệu khóa học</h2>
            <p className="mt-3 leading-relaxed text-mist-400">{course.description}</p>
          </div>

          <div className="card-surface mt-6 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-foreground">Bạn sẽ đạt được gì</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {course.outcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-3 text-mist-300">
                  <span className="mt-1 text-gold-400">✓</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="glow-interactive glow-gold card-surface rounded-2xl p-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-foreground">
                {formatVnd(course.price)}
              </span>
              {course.originalPrice && (
                <span className="text-mist-500 line-through">{formatVnd(course.originalPrice)}</span>
              )}
            </div>
            <Button href="/lien-he" className="mt-6 w-full">
              Đăng ký khóa học
            </Button>
            <p className="mt-4 text-center text-xs text-mist-500">
              Thanh toán an toàn · Hỗ trợ trong suốt quá trình học
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-extrabold">Khóa học liên quan</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {related.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
