"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";

export function Showcase() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.bottom > 0 && rect.top < vh) {
          const progress = (vh - rect.top) / (vh + rect.height);
          setOffset((progress - 0.5) * 80);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-[300px] overflow-hidden bg-deep-2 md:h-[380px]"
    >
      <div
        className="absolute inset-x-0 -inset-y-[10%] bg-cover bg-center will-change-transform"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1800&q=80')",
          transform: `translate3d(0, ${offset}px, 0) scale(1.15)`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,60,93,0.85)_0%,rgba(11,60,93,0.4)_60%,rgba(11,60,93,0.85)_100%)]" />
      <div className="relative z-[2] flex h-full items-center text-white">
        <div className="container-x">
          <Reveal>
            <div className="font-heading mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-solar">
              Energia limpa, vendas constantes
            </div>
            <h3 className="mb-4 max-w-[720px] text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.1]">
              Enquanto o sol nasce, <span className="text-solar">seu funil enche.</span>
            </h3>
            <p className="max-w-[560px] text-base text-white/85 md:text-lg">
              Sua página não dorme. Cada visita vira simulação, cada simulação vira lead com
              contexto.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
