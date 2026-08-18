import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EpisodeCard from "@/components/podcast/EpisodeCard";
import { episodes, formatVnDate } from "@/lib/data";

export function generateStaticParams() {
  return episodes.map((episode) => ({ slug: episode.slug }));
}

async function getEpisode(slug: string) {
  return episodes.find((episode) => episode.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) return {};
  return { title: episode.title, description: episode.summary };
}

export default async function EpisodeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) notFound();

  const others = episodes.filter((e) => e.slug !== episode.slug).slice(0, 2);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/podcast" className="text-sm text-mist-400 hover:text-violet-300">
        ← Tất cả tập podcast
      </Link>

      <div className="mt-6 flex items-center gap-3 text-xs text-mist-500">
        <span>Tập {episode.episodeNumber}</span>
        <span aria-hidden="true">•</span>
        <span>{episode.duration}</span>
        <span aria-hidden="true">•</span>
        <span>{formatVnDate(episode.publishedAt)}</span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{episode.title}</h1>
      {episode.guest && <p className="mt-2 text-mist-400">{episode.guest}</p>}

      <div className="glow-interactive glow-violet card-surface mt-8 flex items-center gap-5 rounded-2xl p-6">
        <button
          type="button"
          className="glow-interactive glow-violet flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-ink-950"
          aria-label="Phát tập podcast"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
        </button>
        <div className="h-1.5 flex-1 rounded-full bg-ink-700">
          <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-violet-400 to-gold-400" />
        </div>
        <span className="text-xs text-mist-500">{episode.duration}</span>
      </div>

      <p className="mt-8 leading-relaxed text-mist-300">{episode.summary}</p>

      {others.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-extrabold">Nghe thêm</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {others.map((e) => (
              <EpisodeCard key={e.slug} episode={e} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
