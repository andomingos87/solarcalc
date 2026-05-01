"use client";

import { useEffect, useRef, useState } from "react";
import * as motion from "motion/react-client";
import { Zap } from "lucide-react";
import { CtaButton } from "@/components/cta-button";
import { Reveal } from "@/components/reveal";

type Step =
  | { type: "them" | "me"; delay: number; tag?: string; text: string; time: string }
  | { type: "typing"; who: "them" | "me"; delay: number };

const conversation: Step[] = [
  {
    type: "them",
    delay: 800,
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
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-14 lg:pt-14 lg:pb-24">
      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[300px] -right-[200px] h-[800px] w-[800px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 65%)",
        }}
      />
      {/* Bg image */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 hidden h-full w-[55%] opacity-[0.06] md:block"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to left, black 30%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to left, black 30%, transparent 90%)",
        }}
      />
      <div className="container-x relative z-[2]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-solar-soft px-3.5 py-2 text-xs font-semibold text-solar-deep">
              <span className="dot-ping h-2 w-2 rounded-full bg-solar" />
              Sistema de geração de orçamentos solares
            </span>
            <h1 className="mb-5 text-[clamp(2rem,5.6vw,3.5rem)] leading-[1.05] text-gray-900">
              Receba pedidos de orçamento solar{" "}
              <span className="highlight-underline text-solar">direto no WhatsApp</span>.
            </h1>
            <p className="mb-7 max-w-[520px] text-[19px] text-gray-700">
              Página com calculadora inteligente que filtra curiosos e entrega leads prontos para
              comprar — sem você precisar explicar tudo do zero.
            </p>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <CtaButton href="#cta" variant="solar" size="lg" className="group/cta">
                Quero gerar mais orçamentos →
              </CtaButton>
              <CtaButton href="#calc-demo" variant="ghost" size="lg" className="group/cta">
                Testar calculadora
              </CtaButton>
            </div>
            <div className="flex items-center gap-3.5 text-sm text-gray-700">
              <span className="tracking-widest text-solar">★★★★★</span>
              <span>Usado por 30+ empresas solares</span>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div ref={wrapRef} className="relative">
              {/* Floating images */}
              <div
                className="float-y absolute bottom-[20%] -left-8 z-[3] hidden h-[100px] w-[140px] overflow-hidden rounded-2xl shadow-[0_24px_48px_-16px_rgba(11,60,93,0.32)] md:block"
                style={{ ["--r" as never]: "-6deg", transform: "rotate(-6deg)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=400&q=80"
                  alt="Painel solar"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div
                className="float-y absolute top-[8%] -right-2.5 z-[3] hidden h-[110px] w-[110px] overflow-hidden rounded-full shadow-[0_24px_48px_-16px_rgba(11,60,93,0.32)] md:block"
                style={{ animationDelay: "1s" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=400&q=80"
                  alt="Telhado"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Lead notif */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                className="absolute -top-4 -right-4 z-[4] hidden items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3.5 py-2.5 shadow-[0_12px_32px_-8px_rgba(11,60,93,0.28)] md:flex"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-solar-soft text-solar">
                  <Zap className="h-4 w-4" fill="currentColor" />
                </div>
                <div className="text-xs leading-tight">
                  <strong className="block text-[13px] text-gray-900">
                    +1 lead qualificado
                  </strong>
                  <span className="text-gray-500">agora · veio do simulador</span>
                </div>
              </motion.div>

              {/* WhatsApp mock */}
              <div
                className="group/wpp relative overflow-hidden rounded-3xl border-[8px] border-white bg-whatsapp-bg shadow-[0_32px_72px_-20px_rgba(11,60,93,0.28),0_8px_16px_-8px_rgba(11,60,93,0.1)] transition-transform duration-500 md:[transform:perspective(1200px)_rotateY(-3deg)_rotateX(2deg)] md:hover:[transform:perspective(1200px)_rotateY(0)_rotateX(0)]"
              >
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
                </div>
                <div className="relative flex max-h-[420px] min-h-[360px] flex-col gap-2 p-4">
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
          </Reveal>
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
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      className={`max-w-[78%] rounded-xl px-3.5 py-2.5 text-[14.5px] leading-snug shadow-[0_1px_1px_rgba(0,0,0,0.08)] ${
        side === "them"
          ? "self-start rounded-tl-[4px] bg-white"
          : "self-end rounded-tr-[4px] bg-[#DCF8C6]"
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
