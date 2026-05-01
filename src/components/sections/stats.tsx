type Stat = {
  prefix?: string;
  value: string;
  suffix?: string;
  label: React.ReactNode;
};

const stats: Stat[] = [
  {
    value: "12",
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
    value: "3",
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
    value: "92",
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
    value: "30",
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
      className="relative overflow-hidden bg-[linear-gradient(135deg,#0B3C5D_0%,#082C44_100%)] py-20 text-white"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(11,60,93,0.94) 0%, rgba(8,44,68,0.98) 100%), url('/solarcalc-hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
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
          {stats.map((s) => (
            <Stat key={`${s.prefix ?? ""}${s.value}${s.suffix ?? ""}`} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ prefix = "", value, suffix = "", label }: Stat) {
  return (
    <div className="text-center">
      <div className="font-heading inline-block bg-[linear-gradient(180deg,#FF8A33_0%,#FF6B00_100%)] bg-clip-text text-[clamp(3rem,6vw,4rem)] font-extrabold leading-none tracking-tight text-transparent">
        {prefix}
        {value}
        {suffix}
      </div>
      <div className="mt-2.5 text-sm font-medium text-white/75">{label}</div>
    </div>
  );
}
