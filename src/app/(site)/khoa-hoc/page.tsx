import type { Metadata } from "next";
import CourseCard from "@/components/course/CourseCard";
import { courses } from "@/lib/data";

export const metadata: Metadata = {
  title: "Khóa học",
  description: "Các khóa học về nhận diện thương hiệu và thương hiệu cá nhân của Nguyễn Quốc Khánh.",
};

export default function CoursesPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
          Khóa học
        </span>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          Học nhận diện thương hiệu từ nền tảng đến chuyên sâu
        </h1>
        <p className="mt-4 text-mist-400">
          Mỗi khóa học được đúc kết từ kinh nghiệm thực chiến, tập trung vào ứng dụng thực tế thay
          vì lý thuyết suông. Học theo tiến độ riêng, truy cập trọn đời.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </section>
  );
}
