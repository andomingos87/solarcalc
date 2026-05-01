import { Check } from "lucide-react";
import { CtaButton } from "@/components/cta-button";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";

const features = [
  "Página personalizada",
  "Calculadora de economia solar",
  "Integração com WhatsApp",
  "Copy pronta p/ conversão",
  "Pronta para tráfego pago",
  "Implementação rápida",
];

export function Offer() {
  return (
    <section id="preco" className="relative overflow-hidden bg-deep py-16 text-white lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[250px] left-1/2 h-[700px] w-[700px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 65%)",
        }}
      />
      <div className="container-x relative">
        <Reveal>
          <SectionHead
            eyebrow="Oferta de entrada"
            title="Teste a SolarCalc na sua empresa."
            sub="Tudo pronto pra rodar — você só conecta o WhatsApp e ativa o tráfego."
            light
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative grid grid-cols-1 items-center gap-6 rounded-3xl bg-[linear-gradient(135deg,white_0%,#FFFBF6_100%)] p-8 text-gray-900 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.4)] md:grid-cols-[1fr_1.2fr_auto] md:gap-10 md:p-12">
            <div className="relative pb-6 md:border-b-0 md:border-r md:border-gray-200 md:pb-0 md:pr-8">
              <span className="mb-3 inline-block rounded-md bg-solar-soft px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-solar-deep">
                Plano Teste
              </span>
              <div className="font-heading text-[clamp(2.75rem,5vw,4rem)] font-extrabold leading-none tracking-tight text-solar">
                R$ 497
              </div>
              <div className="mt-2 text-sm text-gray-700">
                pagamento único · entrega rápida
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
              {features.map((f) => (
                <div
                  key={f}
                  className="group flex items-start gap-2.5 text-[15px] text-gray-700 transition-[color,transform] duration-200 hover:translate-x-0.5 hover:text-gray-900"
                >
                  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-solar text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {f}
                </div>
              ))}
            </div>

            <CtaButton href="#cta" variant="solar" size="lg" className="group/cta">
              Quero testar →
            </CtaButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
