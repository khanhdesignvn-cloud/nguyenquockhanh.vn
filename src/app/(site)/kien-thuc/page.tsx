import type { Metadata } from "next";
import ArticleCard from "@/components/article/ArticleCard";
import { articles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kiến thức",
  description: "Kiến thức chuyên sâu về nhận diện thương hiệu, thiết kế và thương hiệu cá nhân.",
};

export default function KnowledgePage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
          Kiến thức
        </span>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          Góc nhìn chuyên sâu về nhận diện thương hiệu
        </h1>
        <p className="mt-4 text-mist-400">
          Những bài viết đúc kết kinh nghiệm thực chiến — giúp bạn hiểu đúng và làm đúng ngay từ
          đầu, không cần đi đường vòng.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
