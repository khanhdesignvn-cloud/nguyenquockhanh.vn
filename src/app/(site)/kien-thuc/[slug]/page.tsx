import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/article/ArticleCard";
import { articles, formatVnDate } from "@/lib/data";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

async function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const others = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/kien-thuc" className="text-sm text-mist-400 hover:text-gold-300">
        ← Tất cả bài viết
      </Link>

      <span className="mt-6 inline-block w-fit rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
        {article.category}
      </span>

      <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{article.title}</h1>

      <div className="mt-4 flex items-center gap-3 text-xs text-mist-500">
        <span>{formatVnDate(article.publishedAt)}</span>
        <span aria-hidden="true">•</span>
        <span>{article.readingTime}</span>
      </div>

      <div className="card-surface mt-8 rounded-2xl p-6">
        <p className="text-lg leading-relaxed text-mist-300">{article.excerpt}</p>
        <p className="mt-5 leading-relaxed text-mist-400">
          Nội dung đầy đủ của bài viết đang được biên soạn. Đăng ký nhận bản tin hoặc theo dõi
          podcast để không bỏ lỡ những chia sẻ mới nhất về nhận diện thương hiệu.
        </p>
      </div>

      {others.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-extrabold">Bài viết khác</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {others.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
