import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-full bg-bg-brand-soft px-3.5 py-2 text-xs font-semibold tracking-[0.2px] text-text-brand",
        className,
      )}
    >
      {children}
    </span>
  );
}
