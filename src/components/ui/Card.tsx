import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "li";
};

export function Card({ children, className, as: Tag = "article" }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-3xl border border-border-default bg-surface p-7 shadow-[0_1.9px_3.8px_rgb(15_25_23_/_0.06)] transition-transform duration-200 motion-safe:hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
