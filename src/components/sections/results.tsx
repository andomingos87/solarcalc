import { ArrowUp, ArrowDown, Zap, Check, TrendingUp } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";

const tiles = [
  { icon: ArrowUp, title: "Leads mais preparados" },
  { icon: ArrowDown, title: "Menos curiosos no WhatsApp" },
  { icon: Zap, title: "Atendimento mais rápido" },
  { icon: Check, title: "Mais taxa de fechamento" },
  { icon: TrendingUp, title: "Previsibilidade de vendas" },
];

export function Results() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
      <div className="container-x">
        <Reveal>
          <SectionHead
            eyebrow="Resultado na operação"
            title={
              <>
                Mais qualidade. <span className="text-solar">Menos esforço.</span>
              </>
            }
          />
        </Reveal>

        <RevealStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tiles.map(({ icon: Icon, title }) => (
            <RevealItem
              key={title}
              className="group rounded-2xl border border-gray-200 bg-white p-5 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1.5 hover:border-solar hover:shadow-[0_16px_36px_-16px_rgba(255,107,0,0.22)]"
            >
              <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl bg-solar-soft text-solar transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-rotate-6">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="text-base leading-snug">{title}</h4>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
