import { Reveal, RevealItem, RevealStagger } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";

const steps = [
  {
    n: "01",
    title: "Cliente acessa",
    desc: "Vem do Insta, anúncio ou indicação. Cai na sua página.",
    img: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=600&q=80",
  },
  {
    n: "02",
    title: "Simula em 10s",
    desc: "Responde quanto paga de luz. Calculadora mostra a economia.",
    img: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&w=600&q=80",
  },
  {
    n: "03",
    title: "Vê o valor",
    desc: '"Você economiza R$ 740/mês" — gatilho de interesse real.',
    img: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=600&q=80",
  },
  {
    n: "04",
    title: "Cai no seu WhatsApp",
    desc: "Já com contexto. Pronto pra receber proposta.",
    img: "https://images.unsplash.com/photo-1611365892117-bce8ce0e9e21?auto=format&fit=crop&w=600&q=80",
  },
];

export function Flow() {
  return (
    <section id="funciona" className="py-16 lg:py-24">
      <div className="container-x">
        <Reveal>
          <SectionHead
            eyebrow="Como o lead chega educado"
            title={
              <>
                Do simulador pro <span className="text-solar">fechamento</span> em 4 passos.
              </>
            }
            sub='O cliente não chega "perguntando preço". Ele chega já sabendo quanto pode economizar — e por isso quer avançar.'
          />
        </Reveal>

        <RevealStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <RevealItem
              key={step.n}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                style={{ backgroundImage: `url('${step.img}')` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,60,93,0)_35%,rgba(8,44,68,0.92)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 z-[2] p-5 text-white transition-transform duration-300 group-hover:-translate-y-1">
                <span className="font-heading mb-2.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-solar text-[13px] font-bold">
                  {step.n}
                </span>
                <h4 className="mb-1.5 text-[17px]">{step.title}</h4>
                <p className="text-[13px] leading-snug text-white/85">{step.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
