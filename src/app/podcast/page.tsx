import type { Metadata } from "next";
import EpisodeCard from "@/components/podcast/EpisodeCard";
import { episodes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Podcast",
  description: "Podcast về nhận diện thương hiệu và thương hiệu cá nhân cùng Nguyễn Quốc Khánh.",
};

export default function PodcastPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
          Podcast
        </span>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          Câu chuyện thương hiệu, kể mỗi tuần
        </h1>
        <p className="mt-4 text-mist-400">
          Những cuộc trò chuyện về chiến lược, thiết kế và câu chuyện đứng sau các thương hiệu —
          phát hành đều đặn trên các nền tảng nghe podcast.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.slug} episode={episode} />
        ))}
      </div>
    </section>
  );
}
