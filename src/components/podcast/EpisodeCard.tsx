import Link from "next/link";
import { type Episode, formatVnDate } from "@/lib/data";

export default function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <Link
      href={`/podcast/${episode.slug}`}
      className="glow-interactive glow-violet card-surface group flex gap-5 rounded-2xl p-5"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-ink-800 text-violet-300">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
        </svg>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 text-xs text-mist-500">
          <span>Tập {episode.episodeNumber}</span>
          <span aria-hidden="true">•</span>
          <span>{episode.duration}</span>
          <span aria-hidden="true">•</span>
          <span>{formatVnDate(episode.publishedAt)}</span>
        </div>
        <h3 className="mt-1.5 font-bold text-foreground group-hover:text-violet-200">
          {episode.title}
        </h3>
        {episode.guest && <p className="mt-1 text-xs text-mist-500">{episode.guest}</p>}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist-400">{episode.summary}</p>
      </div>
    </Link>
  );
}
