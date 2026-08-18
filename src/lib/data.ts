export type Course = {
  slug: string;
  title: string;
  tagline: string;
  level: string;
  duration: string;
  lessons: number;
  price: number;
  originalPrice?: number;
  description: string;
  outcomes: string[];
};

export const courses: Course[] = [
  {
    slug: "nen-tang-nhan-dien-thuong-hieu",
    title: "Nền tảng Nhận diện Thương hiệu",
    tagline: "Xây bộ nhận diện có chiến lược, không chỉ là logo đẹp",
    level: "Người mới bắt đầu",
    duration: "6 giờ video",
    lessons: 24,
    price: 1490000,
    originalPrice: 2490000,
    description:
      "Khóa học nền tảng giúp bạn hiểu đúng bản chất của nhận diện thương hiệu: từ định vị, hệ giá trị, đến cách chuyển hóa chiến lược thành hình ảnh thị giác nhất quán.",
    outcomes: [
      "Xác định định vị và cá tính thương hiệu rõ ràng",
      "Xây dựng hệ thống màu sắc, typography, logo có logic",
      "Tránh 7 sai lầm phổ biến khi làm nhận diện thương hiệu",
    ],
  },
  {
    slug: "chien-luoc-thuong-hieu-ca-nhan",
    title: "Chiến lược Thương hiệu Cá nhân",
    tagline: "Định vị bản thân để trở thành lựa chọn hiển nhiên",
    level: "Trung cấp",
    duration: "8 giờ video",
    lessons: 32,
    price: 1990000,
    originalPrice: 2990000,
    description:
      "Dành cho chuyên gia, founder, freelancer muốn xây dựng thương hiệu cá nhân có chiều sâu — từ câu chuyện, thông điệp cốt lõi đến cách hiện diện nhất quán trên mọi nền tảng.",
    outcomes: [
      "Xây dựng thông điệp cốt lõi (core message) khác biệt",
      "Thiết kế lộ trình nội dung cá nhân hóa theo từng kênh",
      "Tăng độ nhận diện và niềm tin với khách hàng mục tiêu",
    ],
  },
  {
    slug: "thiet-ke-he-thong-thuong-hieu",
    title: "Thiết kế Hệ thống Thương hiệu Toàn diện",
    tagline: "Từ brand guideline đến ứng dụng thực tế đa nền tảng",
    level: "Nâng cao",
    duration: "10 giờ video",
    lessons: 40,
    price: 2990000,
    description:
      "Khóa học chuyên sâu về xây dựng bộ brand guideline hoàn chỉnh và triển khai nhận diện nhất quán trên bao bì, không gian, ấn phẩm số và truyền thông.",
    outcomes: [
      "Xây dựng brand guideline chuẩn agency",
      "Triển khai nhận diện đồng bộ trên đa nền tảng",
      "Quy trình làm việc với khách hàng và đối tác thiết kế",
    ],
  },
];

export type Episode = {
  slug: string;
  title: string;
  guest?: string;
  duration: string;
  episodeNumber: number;
  summary: string;
  publishedAt: string;
};

export const episodes: Episode[] = [
  {
    slug: "thuong-hieu-khong-phai-la-logo",
    title: "Thương hiệu không phải là logo",
    duration: "42 phút",
    episodeNumber: 12,
    summary:
      "Giải mã hiểu lầm phổ biến nhất về thương hiệu, và những gì thực sự tạo nên một thương hiệu mạnh trong tâm trí khách hàng.",
    publishedAt: "2026-07-02",
  },
  {
    slug: "xay-thuong-hieu-ca-nhan-tu-con-so-0",
    title: "Xây thương hiệu cá nhân từ con số 0",
    guest: "Khách mời: một nhà sáng tạo nội dung",
    duration: "55 phút",
    episodeNumber: 11,
    summary:
      "Hành trình xây dựng thương hiệu cá nhân từ những bước đầu tiên: định vị, nội dung, và giữ vững bản sắc giữa thị trường ồn ào.",
    publishedAt: "2026-06-18",
  },
  {
    slug: "khi-nao-doanh-nghiep-can-lam-lai-nhan-dien",
    title: "Khi nào doanh nghiệp cần làm lại nhận diện?",
    duration: "38 phút",
    episodeNumber: 10,
    summary:
      "Những dấu hiệu cho thấy đã đến lúc rebrand, và cách tiếp cận để làm mới nhận diện mà không đánh mất tài sản thương hiệu đã có.",
    publishedAt: "2026-06-04",
  },
  {
    slug: "mau-sac-trong-thiet-ke-thuong-hieu",
    title: "Tâm lý màu sắc trong thiết kế thương hiệu",
    duration: "47 phút",
    episodeNumber: 9,
    summary:
      "Vì sao các thương hiệu lớn chọn màu sắc không hề ngẫu nhiên, và cách ứng dụng tâm lý màu sắc vào bộ nhận diện của riêng bạn.",
    publishedAt: "2026-05-21",
  },
];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  publishedAt: string;
};

export const articles: Article[] = [
  {
    slug: "5-nguyen-tac-xay-dung-bo-nhan-dien-thuong-hieu",
    title: "5 nguyên tắc xây dựng bộ nhận diện thương hiệu bền vững",
    excerpt:
      "Một bộ nhận diện đẹp chưa chắc đã hiệu quả. Đây là 5 nguyên tắc cốt lõi giúp nhận diện thương hiệu tồn tại và phát triển cùng doanh nghiệp.",
    category: "Chiến lược thương hiệu",
    readingTime: "6 phút đọc",
    publishedAt: "2026-07-20",
  },
  {
    slug: "phan-biet-brand-identity-va-visual-identity",
    title: "Phân biệt Brand Identity và Visual Identity",
    excerpt:
      "Hai khái niệm thường bị nhầm lẫn nhưng có vai trò rất khác nhau trong hệ thống thương hiệu. Hiểu đúng để xây đúng.",
    category: "Kiến thức nền tảng",
    readingTime: "5 phút đọc",
    publishedAt: "2026-07-08",
  },
  {
    slug: "quy-trinh-thiet-ke-logo-chuyen-nghiep",
    title: "Quy trình thiết kế logo chuyên nghiệp gồm những bước nào?",
    excerpt:
      "Từ nghiên cứu thị trường, phác thảo ý tưởng đến thử nghiệm và hoàn thiện — quy trình chuẩn để có một logo thực sự đại diện cho thương hiệu.",
    category: "Thiết kế",
    readingTime: "8 phút đọc",
    publishedAt: "2026-06-25",
  },
  {
    slug: "thuong-hieu-ca-nhan-cho-nguoi-di-lam",
    title: "Thương hiệu cá nhân cho người đi làm: bắt đầu từ đâu?",
    excerpt:
      "Không cần là người nổi tiếng, bất kỳ ai cũng có thể xây dựng thương hiệu cá nhân để tạo lợi thế trong sự nghiệp.",
    category: "Thương hiệu cá nhân",
    readingTime: "7 phút đọc",
    publishedAt: "2026-06-10",
  },
];

export function formatVnd(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

export function formatVnDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
