"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { type ServiceId, type ServiceItem } from "@/lib/content";

export type { ServiceId, ServiceItem };

type ServiceVisualProps = {
  item: ServiceItem;
  className?: string;
  sizes: string;
};

export function ServiceVisual({ item, className, sizes }: ServiceVisualProps) {
  const [photoReady, setPhotoReady] = useState(false);

  return (
    <div className={cn("relative isolate overflow-hidden bg-ink", className)}>
      <BrandPlaceholder id={item.id} />
      {item.image ? (
        <Image
          src={item.image}
          alt=""
          fill
          sizes={sizes}
          onLoad={() => setPhotoReady(true)}
          onError={() => setPhotoReady(false)}
          className={cn(
            "z-10 object-cover object-[center_22%]",
            photoReady ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}
    </div>
  );
}

function BrandPlaceholder({ id }: { id: ServiceId }) {
  switch (id) {
    case "ai":
      return (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_38%,#087e6b_0%,#0f1917_58%)]">
          <span
            aria-hidden="true"
            className="absolute -top-16 -right-10 size-[240px] opacity-40 md:size-[280px]"
            style={{
              backgroundImage: "url(/brand/hero-orbit.svg)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          />
          <span className="absolute top-[16%] left-[10%] size-[220px] rounded-full border border-accent/45 md:size-[260px]" />
          <span className="absolute top-[24%] left-[16%] size-[160px] rounded-full border border-core-white/20 md:size-[190px]" />
          <span className="absolute right-[18%] bottom-[22%] size-2 rounded-full bg-accent" />
          <span className="absolute right-[28%] bottom-[34%] size-1.5 rounded-full bg-core-white/70" />
          <span className="absolute left-[42%] top-[48%] size-1.5 rounded-full bg-accent/80" />
        </div>
      );
    case "automation":
      return (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f1917_0%,#074f46_48%,#0f1917_100%)]">
          <span className="absolute top-[22%] right-[-20%] size-[280px] rounded-full border border-accent/30" />
          <span className="absolute top-1/2 left-[8%] h-px w-[70%] -translate-y-1/2 bg-accent/50" />
          <span className="absolute top-[38%] left-[18%] size-3 rounded-full bg-accent" />
          <span className="absolute top-1/2 left-[46%] size-3 -translate-y-1/2 rounded-full border-2 border-accent bg-ink" />
          <span className="absolute top-[58%] right-[22%] size-3 rounded-full bg-core-white" />
          <span className="absolute top-[30%] left-[8%] h-[40%] w-px bg-core-white/15" />
        </div>
      );
    case "software":
      return (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,#086456_0%,#0f1917_55%)]">
          <span className="absolute top-[18%] left-[12%] h-[54%] w-[62%] rounded-2xl border border-core-white/20 bg-core-white/5" />
          <span className="absolute top-[28%] left-[22%] h-[48%] w-[58%] rounded-2xl border border-accent/40 bg-ink/40" />
          <span className="absolute top-[22%] left-[18%] h-1.5 w-8 rounded-full bg-accent/80" />
          <span className="absolute right-[16%] bottom-[18%] size-[120px] rounded-full bg-accent/20 blur-xl" />
        </div>
      );
    case "web":
      return (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,#3fd0b4_0%,#0f1917_46%)]">
          <span
            aria-hidden="true"
            className="absolute -bottom-24 left-1/2 size-[320px] -translate-x-1/2 opacity-55 md:size-[380px]"
            style={{
              backgroundImage: "url(/brand/hero-orbit.svg)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          />
          <span className="absolute top-[18%] right-[10%] left-[10%] h-px bg-core-white/20" />
          <span className="absolute top-[18%] left-[14%] size-2 rounded-full bg-accent" />
          <span className="absolute top-[12%] right-[16%] h-8 w-20 rounded-full border border-core-white/25" />
        </div>
      );
    case "integrations":
      return (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#087e6b_0%,#0f1917_50%)]">
          <span
            aria-hidden="true"
            className="absolute top-[8%] left-[4%] size-[220px] text-accent opacity-60 md:size-[260px]"
            style={{
              backgroundImage: "url(/brand/global-orbit.svg)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          />
          <span className="absolute top-[12%] left-[8%] size-[200px] rounded-full border border-accent/50 md:size-[240px]" />
          <span className="absolute top-[28%] left-[28%] size-[180px] rounded-full border border-core-white/25 md:size-[220px]" />
          <span className="absolute right-[6%] bottom-[10%] size-[160px] rounded-full border border-accent/30" />
          <span className="absolute top-[36%] left-[34%] size-3 rounded-full bg-accent" />
          <span className="absolute top-[48%] left-[52%] size-3 rounded-full bg-core-white" />
          <span className="absolute bottom-[28%] right-[22%] size-3 rounded-full bg-accent/80" />
        </div>
      );
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
