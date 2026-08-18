import Link from "next/link";
import { type Article, formatVnDate } from "@/lib/data";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/kien-thuc/${article.slug}`}
      className="glow-interactive glow-gold card-surface group flex flex-col rounded-2xl p-6"
    >
      <span className="w-fit rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
        {article.category}
      </span>
      <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-gold-200">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mist-400">{article.excerpt}</p>
      <div className="mt-5 flex items-center gap-3 border-t border-ink-700 pt-4 text-xs text-mist-500">
        <span>{formatVnDate(article.publishedAt)}</span>
        <span aria-hidden="true">•</span>
        <span>{article.readingTime}</span>
      </div>
    </Link>
  );
}
