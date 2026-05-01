import { cn } from "@/lib/utils";

type SectionHeadProps = {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  center?: boolean;
  className?: string;
  light?: boolean;
};

export function SectionHead({
  eyebrow,
  title,
  sub,
  center = true,
  className,
  light = false,
}: SectionHeadProps) {
  return (
    <div className={cn("mb-12", center && "text-center", className)}>
      {eyebrow && (
        <div className="font-heading mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-solar">
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          "mb-4 max-w-[720px] text-[clamp(1.875rem,4vw,2.625rem)]",
          light ? "text-white" : "text-gray-900",
          center && "mx-auto",
        )}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={cn(
            "max-w-[640px] text-lg",
            light ? "text-white/75" : "text-gray-700",
            center && "mx-auto",
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
