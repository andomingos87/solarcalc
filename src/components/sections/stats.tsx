"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  prefix?: string;
  count: number;
  suffix?: string;
  label: React.ReactNode;
};

const stats: Stat[] = [
  {
    count: 12,
    suffix: "x",
    label: (
      <>
        Mais leads que site
        <br />
        convencional
      </>
    ),
  },
  {
    prefix: "~",
    count: 3,
    suffix: "min",
    label: (
      <>
        Tempo médio de
        <br />
        resposta no WhatsApp
      </>
    ),
  },
  {
    count: 92,
    suffix: "%",
    label: (
      <>
        Economia média
        <br />
        simulada por cliente
      </>
    ),
  },
  {
    count: 30,
    suffix: "+",
    label: (
      <>
        Empresas solares
        <br />
        já usando
      </>
    ),
  },
];

export function Stats() {
  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(11,60,93,0.92)_0%,rgba(8,44,68,0.96)_100%)] py-20 text-white"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(11,60,93,0.92) 0%, rgba(8,44,68,0.96) 100%), url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[200px] -right-[200px] h-[600px] w-[600px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,0,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[150px] -left-[100px] h-[400px] w-[400px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 70%)",
        }}
      />
      <div className="container-x">
        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Stat key={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ prefix = "", count, suffix = "", label }: Stat) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        obs.disconnect();
        const duration = 1400;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(count * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [count]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading inline-block bg-[linear-gradient(180deg,#FF8A33_0%,#FF6B00_100%)] bg-clip-text text-[clamp(3rem,6vw,4rem)] font-extrabold leading-none tracking-tight text-transparent">
        {prefix}
        {value}
        {suffix}
      </div>
      <div className="mt-2.5 text-sm font-medium text-white/75">{label}</div>
    </div>
  );
}
