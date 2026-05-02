"use client";

import { useEffect, useRef, useState } from "react";
import * as motion from "motion/react-client";
import { Calculator, MessageCircle, TrendingUp, Zap } from "lucide-react";
import { CtaButton } from "@/components/cta-button";
import { LogoMark } from "@/components/logo";
import { whatsappHref } from "@/lib/whatsapp";

type Step =
  | { type: "them" | "me"; delay: number; tag?: string; text: string; time: string }
  | { type: "typing"; who: "them" | "me"; delay: number };

const conversation: Step[] = [
  {
    type: "them",
    delay: 0,
    tag: "⚡ veio do simulador",
    text: "Oi! Simulei aqui, dá <b>R$ 740/mês</b> de economia pra mim.",
    time: "14:32",
  },
  {
    type: "them",
    delay: 1600,
    text: "Conta de luz é R$ 800, casa em SP, telhado bom. Quero meu orçamento.",
    time: "14:32",
  },
  { type: "typing", who: "me", delay: 1200 },
  {
    type: "me",
    delay: 1100,
    text: "Olá Marina! Pra esse perfil, sistema 5kWp ≈ R$ 22 mil. Posso enviar a proposta agora?",
    time: "14:33",
  },
  { type: "typing", who: "them", delay: 1100 },
  {
    type: "them",
    delay: 900,
    text: "Pode mandar! 👍 Quando podemos agendar a visita técnica?",
    time: "14:33",
  },
];

type RenderItem =
  | { kind: "bubble"; side: "them" | "me"; tag?: string; text: string; time: string; key: string }
  | { kind: "typing"; side: "them" | "me"; key: string };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<RenderItem[]>([]);
  const playedRef = useRef(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      async (entries) => {
        const e = entries[0];
        if (!e?.isIntersecting || playedRef.current) return;
        playedRef.current = true;
        obs.disconnect();
        let count = 0;
        for (const step of conversation) {
          await wait(step.delay);
          if (step.type === "typing") {
            const key = `t-${count++}`;
            setItems((prev) => [...prev, { kind: "typing", side: step.who, key }]);
          } else {
            const key = `b-${count++}`;
            setItems((prev) => {
              const filtered = prev.filter((i) => i.kind !== "typing");
              return [
                ...filtered,
                {
                  kind: "bubble",
                  side: step.type,
                  tag: step.tag,
                  text: step.text,
                  time: step.time,
                  key,
                },
              ];
            });
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="hero-shell relative overflow-hidden bg-deep-2 py-12 text-white lg:min-h-[calc(100vh-70px)] lg:py-16">
      <div aria-hidden className="hero-brand-image pointer-events-none absolute inset-0" />
      <div className="hero-solar-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[18%] -top-[28%] h-[760px] w-[760px] rounded-full bg-solar/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[28%] -left-[18%] h-[620px] w-[620px] rounded-full bg-[#25d366]/10 blur-3xl"
      />
      <div className="container-x relative z-[2]">
        <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-[0.94fr_1.06fr] lg:gap-12">
          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
              <span className="dot-ping h-2 w-2 rounded-full bg-solar" />
              Solarcalc para empresas solares
            </span>
            <h1 className="mb-6 max-w-[660px] text-[clamp(2.35rem,5.7vw,5.35rem)] leading-[0.95] text-white">
              <span className="hero-wordmark">Leads solares</span> prontos no WhatsApp.
            </h1>
            <p className="mb-8 max-w-[590px] text-[18px] leading-relaxed text-white/76 md:text-[20px]">
              A SolarCalc transforma simulações de economia em pedidos de orçamento com contexto,
              direto para sua equipe comercial.
            </p>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <CtaButton
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="solar"
                size="lg"
                className="group/cta"
              >
                Quero leads solares →
              </CtaButton>
              <CtaButton
                href="#calc-demo"
                variant="ghost"
                size="lg"
                className="group/cta border-white/20 bg-white/10 text-white backdrop-blur hover:border-white/35 hover:bg-white/15"
              >
                Testar calculadora
              </CtaButton>
            </div>
            <div className="hidden max-w-[560px] grid-cols-3 gap-2.5 text-left sm:grid">
              {[
                ["92%", "economia simulada"],
                ["3 min", "lead no WhatsApp"],
                ["30+", "empresas solares"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/7 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur"
                >
                  <div className="font-heading text-xl font-extrabold leading-none text-solar">
                    {value}
                  </div>
                  <div className="mt-1 text-[11px] font-medium leading-tight text-white/58">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div ref={wrapRef} className="relative mx-auto max-w-[620px] lg:max-w-none">
              <div className="absolute -left-3 top-10 z-[3] hidden rounded-2xl border border-white/12 bg-white/10 p-3 text-white shadow-[0_24px_54px_-24px_rgba(0,0,0,0.65)] backdrop-blur-xl md:block">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-solar text-white">
                    <Calculator className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-heading text-sm font-bold">Simulação pronta</div>
                    <div className="text-xs text-white/58">R$ 740/mês de economia</div>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                className="absolute -right-2 -top-3 z-[4] hidden items-center gap-2.5 rounded-2xl border border-white/12 bg-[#0f4e74]/90 px-3.5 py-2.5 text-white shadow-[0_22px_48px_-22px_rgba(0,0,0,0.65)] backdrop-blur-xl md:flex"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-solar text-white">
                  <Zap className="h-4 w-4" fill="currentColor" />
                </div>
                <div className="text-xs leading-tight">
                  <strong className="block text-[13px] text-white">+1 lead qualificado</strong>
                  <span className="text-white/58">agora · veio do simulador</span>
                </div>
              </motion.div>

              <div className="hero-device group/wpp relative overflow-hidden rounded-[26px] border border-white/12 bg-[#092f49]/92 p-2.5 shadow-[0_44px_110px_-45px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur md:rounded-[32px] md:p-3">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,107,0,0.18),transparent_34%),radial-gradient(circle_at_85%_12%,rgba(37,211,102,0.12),transparent_30%)]" />
                <div className="relative grid gap-3 lg:grid-cols-[0.86fr_1fr]">
                  <div className="relative overflow-hidden rounded-[20px] bg-[#06253a] p-4 text-white md:rounded-[24px] md:p-5">
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-solar/20 blur-2xl" />
                    <div className="relative mb-7 flex items-center justify-between">
                      <LogoMark className="h-10 w-10" />
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white/66">
                        ao vivo
                      </span>
                    </div>
                    <div className="relative">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/54">
                        Economia calculada
                      </div>
                      <div className="font-heading text-[clamp(2.5rem,5vw,4.25rem)] font-extrabold leading-none text-solar">
                        R$ 740
                      </div>
                      <div className="mt-1 text-sm text-white/64">por mês no perfil residencial</div>
                      <div className="mt-5 space-y-2.5 md:mt-7 md:space-y-3">
                        {[
                          ["Conta atual", "R$ 800"],
                          ["Payback estimado", "3,0 anos"],
                          ["Chance comercial", "Alta"],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/7 px-3.5 py-3"
                          >
                            <span className="text-xs text-white/54">{label}</span>
                            <span className="font-heading text-sm font-bold text-white">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#72ef9b] md:mt-7">
                      <TrendingUp className="h-4 w-4" />
                      lead educado antes do atendimento
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-whatsapp-bg shadow-[0_18px_50px_-26px_rgba(0,0,0,0.55)] md:rounded-[24px]">
                    <div className="wpp-pattern pointer-events-none absolute inset-0" />
                    <div className="relative flex items-center gap-3 bg-whatsapp-deep px-4 py-3.5 text-white">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-solar font-heading font-bold">
                        M
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold leading-tight">Marina S.</div>
                        <div className="mt-0.5 text-xs leading-tight opacity-85">
                          online · veio do simulador
                        </div>
                      </div>
                      <MessageCircle className="ml-auto h-4 w-4 opacity-70" />
                    </div>
                    <div className="relative flex min-h-[300px] flex-col gap-2 p-3 md:min-h-[390px] md:p-4">
                      {items.map((it) =>
                        it.kind === "typing" ? (
                          <TypingBubble key={it.key} side={it.side} />
                        ) : (
                          <Bubble
                            key={it.key}
                            side={it.side}
                            tag={it.tag}
                            text={it.text}
                            time={it.time}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bubble({
  side,
  tag,
  text,
  time,
}: {
  side: "them" | "me";
  tag?: string;
  text: string;
  time: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      className={`max-w-[78%] rounded-xl px-3.5 py-2.5 text-[14.5px] leading-snug shadow-[0_1px_1px_rgba(0,0,0,0.08)] ${
        side === "them"
          ? "self-start rounded-tl-[4px] bg-white text-gray-900"
          : "self-end rounded-tr-[4px] bg-[#DCF8C6] text-gray-900"
      }`}
    >
      {tag && (
        <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-md bg-solar-soft px-2 py-0.5 text-[11px] font-semibold text-solar-deep">
          {tag}
        </span>
      )}
      <span dangerouslySetInnerHTML={{ __html: text }} />
      <span className="ml-2 text-[10.5px] text-gray-500">
        {time}
        {side === "me" && <span className="ml-1 text-[#4FC3F7]">✓✓</span>}
      </span>
    </motion.div>
  );
}

function TypingBubble({ side }: { side: "them" | "me" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-1 rounded-xl px-4 py-3 shadow-[0_1px_1px_rgba(0,0,0,0.08)] ${
        side === "them"
          ? "self-start rounded-tl-[4px] bg-white"
          : "self-end rounded-tr-[4px] bg-[#DCF8C6]"
      }`}
    >
      <span className="typing-dot h-[7px] w-[7px] rounded-full bg-gray-400" />
      <span className="typing-dot h-[7px] w-[7px] rounded-full bg-gray-400" />
      <span className="typing-dot h-[7px] w-[7px] rounded-full bg-gray-400" />
    </motion.div>
  );
}
