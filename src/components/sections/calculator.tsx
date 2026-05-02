import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";
import { SolarSavingsCalculator } from "@/components/solar-savings-calculator";

export function Calculator() {
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
          <SolarSavingsCalculator />
        </Reveal>
      </div>
    </section>
  );
}
