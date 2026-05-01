"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { CtaButton } from "@/components/cta-button";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";
import { cn } from "@/lib/utils";

const options = [
  { label: "R$ 300", savings: 276, pct: 92 },
  { label: "R$ 500", savings: 460, pct: 92 },
  { label: "R$ 800", savings: 740, pct: 92 },
  { label: "R$ 1.200+", savings: 1110, pct: 92 },
];

export function Calculator() {
  const [active, setActive] = useState(2);
  const [bumpKey, setBumpKey] = useState(0);
  const o = options[active];

  const yearly = (o.savings * 12).toLocaleString("pt-BR");
  const payback = Math.max(3, Math.round((20000 / (o.savings * 12)) * 10) / 10);

  return (
    <section
      id="calc-demo"
      className="bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24"
    >
      <div className="container-x">
        <Reveal>
          <SectionHead
            eyebrow="Teste agora"
            title={
              <>
                A calculadora que <span className="text-solar">educa o seu lead</span>.
              </>
            }
            sub="Quando o cliente chega no WhatsApp, ele já viu quanto economiza. Você só precisa fechar."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto grid max-w-[1040px] grid-cols-1 items-center gap-7 rounded-[28px] bg-white p-7 shadow-[0_24px_60px_-20px_rgba(11,60,93,0.18),0_0_0_1px_var(--color-gray-200)] lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:p-10">
            <div className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-md bg-solar px-2.5 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.08em] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white dot-ping" />
              AO VIVO
            </div>

            <div>
              <h3 className="mb-2 text-2xl text-gray-900">
                Quanto você paga de energia por mês?
              </h3>
              <div className="mb-5 text-sm font-medium text-gray-500">
                Selecione a faixa que mais se aproxima:
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {options.map((opt, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setActive(i);
                        setBumpKey((k) => k + 1);
                      }}
                      className={cn(
                        "relative cursor-pointer overflow-hidden rounded-xl border-2 px-4 py-4 text-left font-heading text-[17px] font-semibold transition-all duration-200",
                        isActive
                          ? "border-solar bg-solar text-white shadow-[0_8px_20px_-6px_rgba(255,107,0,0.45)]"
                          : "border-gray-200 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-solar hover:text-solar hover:shadow-[0_8px_20px_-8px_rgba(255,107,0,0.25)]",
                      )}
                    >
                      {isActive && (
                        <span className="absolute right-3 top-2 text-sm font-bold">✓</span>
                      )}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#0B3C5D_0%,#082C44_100%)] p-7 text-white">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-[80px] -right-[80px] h-[200px] w-[200px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,107,0,0.25) 0%, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/70">
                  Você pode economizar até
                </div>
                <div
                  key={bumpKey}
                  className="font-heading value-bump mb-1 text-[clamp(2.75rem,5vw,3.5rem)] font-extrabold leading-none tracking-tight text-solar"
                >
                  R$ {o.savings.toLocaleString("pt-BR")}/mês
                </div>
                <div className="mb-5 text-sm text-white/85">
                  ≈ R$ {yearly}/ano · payback em ~{payback} anos
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded bg-white/10">
                  <div
                    className="h-full rounded bg-[linear-gradient(90deg,#FF6B00_0%,#FF8A33_100%)] transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ width: `${o.pct}%` }}
                  />
                </div>
                <div className="mb-5 flex justify-between text-[11px] text-white/60">
                  <span>0%</span>
                  <span>{o.pct}% da sua conta</span>
                </div>
                <CtaButton
                  href="#cta"
                  variant="wpp"
                  size="lg"
                  pulse
                  className="group/cta flex w-full justify-center"
                >
                  <Zap className="h-5 w-5" fill="currentColor" />
                  Quero meu orçamento agora
                </CtaButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
