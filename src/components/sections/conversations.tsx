import { Reveal, RevealItem, RevealStagger } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";

type Conv = {
  initial: string;
  avatarBg: string;
  name: string;
  meta: string;
  msgs: { side: "them" | "me"; text: string }[];
};

const convs: Conv[] = [
  {
    initial: "M",
    avatarBg: "bg-whatsapp",
    name: "Marina S.",
    meta: "há 2 min · veio do simulador",
    msgs: [
      { side: "them", text: "Simulei e dá R$ 740/mês de economia." },
      { side: "them", text: "Quero agendar visita técnica essa semana." },
      { side: "me", text: "Posso ir quinta às 14h?" },
    ],
  },
  {
    initial: "C",
    avatarBg: "bg-solar",
    name: "Carlos R.",
    meta: "há 5 min · veio do simulador",
    msgs: [
      { side: "them", text: "Conta R$ 1.200, vi que economizo até R$ 1.100." },
      { side: "them", text: "Aceitam financiamento? Quero fechar essa semana." },
      { side: "me", text: "Sim! Mando proposta com 60x agora." },
    ],
  },
  {
    initial: "J",
    avatarBg: "bg-deep",
    name: "Juliana P.",
    meta: "há 8 min · veio do simulador",
    msgs: [
      { side: "them", text: "Comércio, conta R$ 2.5k." },
      { side: "them", text: "Manda proposta hoje? Quero fechar." },
      { side: "me", text: "Mandando agora 👍" },
    ],
  },
];

export function Conversations() {
  return (
    <section id="prova" className="bg-gray-50 py-16 lg:py-24">
      <div className="container-x">
        <Reveal>
          <SectionHead
            eyebrow="Conversas reais"
            title={
              <>
                Assim chegam os leads <span className="text-solar">de verdade</span>.
              </>
            }
            sub='Sem perguntas básicas. Sem "vou pensar". Cliente já com contexto, querendo fechar.'
          />
        </Reveal>

        <RevealStagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {convs.map((c) => (
            <RevealItem
              key={c.name}
              className="relative overflow-hidden rounded-[20px] border border-gray-200 bg-whatsapp-bg p-[18px] shadow-[0_8px_24px_-12px_rgba(11,60,93,0.16)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-16px_rgba(11,60,93,0.24)]"
            >
              <div className="conv-pattern pointer-events-none absolute inset-0" />
              <div className="absolute right-4 top-4 z-[2] rounded-md bg-solar px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                QUENTE
              </div>
              <div className="relative mb-3 flex items-center gap-2.5 border-b border-dashed border-deep/20 pb-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${c.avatarBg} font-heading text-sm font-bold text-white`}
                >
                  {c.initial}
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight text-gray-900">
                    {c.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-gray-500">{c.meta}</div>
                </div>
              </div>
              <div className="relative flex flex-col gap-1.5">
                {c.msgs.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[88%] rounded-xl px-3 py-2 text-[13.5px] leading-snug shadow-[0_1px_1px_rgba(0,0,0,0.08)] ${
                      m.side === "them"
                        ? "self-start rounded-tl-[4px] bg-white"
                        : "self-end rounded-tr-[4px] bg-[#DCF8C6]"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
