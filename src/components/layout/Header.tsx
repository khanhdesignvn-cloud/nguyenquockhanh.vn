import Link from "next/link";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/khoa-hoc", label: "Khóa học" },
  { href: "/podcast", label: "Podcast" },
  { href: "/kien-thuc", label: "Kiến thức" },
  { href: "/gioi-thieu", label: "Về tôi" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            Nguyễn Quốc <span className="text-gradient">Khánh</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="glow-interactive glow-violet rounded-full px-4 py-2 text-sm font-medium text-mist-300 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button href="/khoa-hoc" className="hidden md:inline-flex">
          Khám phá khóa học
        </Button>

        <MobileNav />
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <details className="relative md:hidden">
      <summary className="glow-interactive glow-gold flex h-10 w-10 list-none items-center justify-center rounded-full border border-ink-600 text-mist-300 [&::-webkit-details-marker]:hidden">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </summary>
      <div className="card-surface absolute right-0 top-12 flex w-56 flex-col gap-1 rounded-2xl p-3 shadow-2xl shadow-black/50">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl px-3 py-2 text-sm font-medium text-mist-300 hover:bg-ink-700/60 hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/khoa-hoc"
          className="mt-1 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-3 py-2 text-center text-sm font-semibold text-ink-950"
        >
          Khám phá khóa học
        </Link>
      </div>
    </details>
  );
}
