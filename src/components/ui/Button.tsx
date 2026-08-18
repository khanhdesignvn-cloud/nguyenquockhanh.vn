import Link from "next/link";
import { type ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export default function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const base =
    "glow-interactive glow-gold inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors";

  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-gold-400 to-gold-500 text-ink-950 hover:from-gold-300 hover:to-gold-400"
      : "border border-ink-600 text-mist-300 hover:text-gold-300 hover:border-gold-400/60";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
