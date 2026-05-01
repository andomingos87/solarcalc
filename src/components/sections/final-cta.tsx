import { Zap } from "lucide-react";
import { CtaButton } from "@/components/cta-button";
import { Reveal } from "@/components/reveal";

export function FinalCta() {
  return (
    <section
      id="cta"
      className="bg-gradient-to-b from-white to-gray-50 py-16 text-center lg:py-24"
    >
      <div className="container-narrow">
        <Reveal>
          <h2 className="mb-7 text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] text-gray-900">
            Você não precisa de mais leads.
            <br />
            <span className="text-solar">Precisa de leads que querem comprar.</span>
          </h2>
          <CtaButton href="#" variant="wpp" size="lg" pulse className="group/cta">
            <Zap className="h-5 w-5" fill="currentColor" />
            Quero minha página com calculadora
          </CtaButton>
          <div className="mt-8 italic text-sm text-gray-500">
            &ldquo;A SolarCalc transforma curiosidade em orçamento.&rdquo;
          </div>
        </Reveal>
      </div>
    </section>
  );
}
