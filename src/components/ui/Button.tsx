import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonBase = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

type LinkButtonProps = ButtonBase & {
  href: string;
  onClick?: () => void;
};

type ActionButtonProps = ButtonBase & {
  href?: never;
  onClick: () => void;
};

export type ButtonProps = LinkButtonProps | ActionButtonProps;

export function Button(props: ButtonProps) {
  const { children, variant = "primary", className, onClick } = props;
  const isPrimary = variant === "primary";
  const classNames = cn(
    "inline-flex h-12 items-center justify-center rounded-[14px] px-[22px] py-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-200",
    isPrimary
      ? "bg-action text-action-fg hover:bg-action-hover"
      : "border border-border-strong bg-surface text-text-primary hover:bg-bg-brand-soft",
    className,
  );

  if (typeof props.href === "string") {
    return (
      <a href={props.href} onClick={onClick} className={classNames}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classNames}>
      {children}
    </button>
  );
}
