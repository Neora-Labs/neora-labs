import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  onClick,
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-[14px] px-[22px] py-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-200",
        isPrimary
          ? "bg-action text-action-fg hover:bg-action-hover"
          : "border border-border-strong bg-surface text-text-primary hover:bg-bg-brand-soft",
        className,
      )}
    >
      {children}
    </a>
  );
}
