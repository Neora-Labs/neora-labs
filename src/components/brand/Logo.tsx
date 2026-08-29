import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandSurface = "on-light" | "on-dark";

type LogoProps = {
  variant: BrandSurface;
  className?: string;
  priority?: boolean;
  alt?: string;
};

const logoSources = {
  "on-light": "/brand/logo-on-light.png",
  "on-dark": "/brand/logo-on-dark.png",
} as const;

const isotypeSources = {
  "on-light": "/brand/isotype.png",
  "on-dark": "/brand/isotype-on-dark.png",
} as const;

export function Logo({ variant, className, priority = false }: LogoProps) {
  return (
    <Image
      src={logoSources[variant]}
      alt="Neora Labs"
      width={175}
      height={44}
      className={cn("object-contain", className ?? "h-11 w-[175px]")}
      priority={priority}
    />
  );
}

export function Isotype({
  variant,
  className,
  priority = false,
  alt = "Neora Labs",
}: LogoProps) {
  return (
    <Image
      src={isotypeSources[variant]}
      alt={alt}
      width={44}
      height={44}
      className={cn("object-contain", className ?? "size-11")}
      priority={priority}
    />
  );
}

export function ThemedLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <>
      <Logo
        variant="on-light"
        priority={priority}
        className={cn("dark:hidden", className)}
      />
      <Logo variant="on-dark" className={cn("hidden dark:block", className)} />
    </>
  );
}

export function ThemedIsotype({
  className,
  priority = false,
  alt = "Neora Labs",
}: {
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  return (
    <>
      <Isotype
        variant="on-light"
        priority={priority}
        alt={alt}
        className={cn("dark:hidden", className ?? "size-11")}
      />
      <Isotype
        variant="on-dark"
        alt={alt}
        className={cn("hidden dark:block", className ?? "size-11")}
      />
    </>
  );
}
