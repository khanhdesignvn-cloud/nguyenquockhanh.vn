import Link from "next/link";
import { type Course, formatVnd } from "@/lib/data";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/khoa-hoc/${course.slug}`}
      className="glow-interactive glow-gold card-surface group flex flex-col rounded-2xl p-6"
    >
      <span className="w-fit rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-300">
        {course.level}
      </span>
      <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-gold-200">
        {course.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-mist-400">{course.tagline}</p>

      <div className="mt-5 flex items-center gap-4 text-xs text-mist-500">
        <span>{course.duration}</span>
        <span aria-hidden="true">•</span>
        <span>{course.lessons} bài học</span>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-ink-700 pt-5">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">{formatVnd(course.price)}</span>
          {course.originalPrice && (
            <span className="text-sm text-mist-500 line-through">
              {formatVnd(course.originalPrice)}
            </span>
          )}
        </div>
        <span className="text-sm font-semibold text-gold-300 group-hover:translate-x-1 transition-transform">
          Xem chi tiết →
        </span>
      </div>
    </Link>
  );
}
