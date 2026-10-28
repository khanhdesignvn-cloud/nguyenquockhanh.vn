import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Về tôi",
  description: "Câu chuyện và hành trình làm nghề nhận diện thương hiệu của Nguyễn Quốc Khánh.",
};

const milestones = [
  {
    year: "2018",
    text: "Bắt đầu hành trình thiết kế thương hiệu, làm việc tại một agency sáng tạo tại TP.HCM.",
  },
  {
    year: "2021",
    text: "Thành lập studio tư vấn nhận diện thương hiệu độc lập, đồng hành cùng hơn 50 doanh nghiệp SME.",
  },
  {
    year: "2023",
    text: "Ra mắt podcast chia sẻ kiến thức thương hiệu, thu hút hàng nghìn người theo dõi mỗi tập.",
  },
  {
    year: "2025",
    text: "Xây dựng hệ thống khóa học online, giúp hàng ngàn học viên tự tin làm chủ nhận diện thương hiệu.",
  },
];

const values = [
  {
    title: "Chiến lược trước, thị giác sau",
    text: "Một bộ nhận diện chỉ thực sự hiệu quả khi được xây trên nền tảng chiến lược rõ ràng.",
  },
  {
    title: "Thực chiến, không lý thuyết suông",
    text: "Mọi kiến thức chia sẻ đều được đúc kết từ dự án thật, khách hàng thật, kết quả thật.",
  },
  {
    title: "Đơn giản để bền vững",
    text: "Nhận diện thương hiệu tốt là nhận diện dễ hiểu, dễ nhớ và dễ triển khai lâu dài.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
        Về tôi
      </span>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
        Xin chào, tôi là <span className="text-gradient">Nguyễn Quốc Khánh</span>
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist-400">
        Tôi tin rằng mỗi thương hiệu — dù là một doanh nghiệp hay một cá nhân — đều có một câu
        chuyện riêng đáng được kể một cách rõ ràng và nhất quán. Công việc của tôi là giúp bạn tìm
        ra câu chuyện đó, và chuyển hóa nó thành một hệ thống nhận diện có chiến lược, có bản sắc.
      </p>

      <div className="card-surface mt-12 grid gap-8 rounded-2xl p-8 sm:grid-cols-3">
        {values.map((value) => (
          <div key={value.title}>
            <h3 className="font-bold text-foreground">{value.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist-400">{value.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-extrabold">Hành trình</h2>
        <div className="mt-8 flex flex-col gap-6 border-l border-ink-700 pl-6">
          {milestones.map((milestone) => (
            <div key={milestone.year} className="relative">
              <span className="absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full bg-gold-400" />
              <span className="text-sm font-bold text-gold-300">{milestone.year}</span>
              <p className="mt-1 text-mist-300">{milestone.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glow-interactive glow-gold card-surface mt-16 flex flex-col items-center gap-5 rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-extrabold">Cùng xây dựng thương hiệu của bạn</h2>
        <p className="max-w-lg text-mist-400">
          Dù bạn muốn học tự làm, hay cần tư vấn trực tiếp — mình luôn sẵn sàng lắng nghe câu
          chuyện thương hiệu của bạn.
        </p>
        <Button href="/lien-he">Liên hệ với tôi</Button>
      </div>
    </section>
  );
}
