import Link from "next/link";
import { type ReactNode } from "react";

type IconLinkProps = {
  href: string;
  label: string;
  children: ReactNode;
};

export default function IconLink({ href, label, children }: IconLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="glow-interactive glow-violet flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 text-mist-300 hover:text-violet-300 hover:border-violet-400/60"
    >
      {children}
    </Link>
  );
}
