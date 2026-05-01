import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Calculator } from "@/components/sections/calculator";
import { Flow } from "@/components/sections/flow";
import { Showcase } from "@/components/sections/showcase";
import { Conversations } from "@/components/sections/conversations";
import { Results } from "@/components/sections/results";
import { Offer } from "@/components/sections/offer";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">
        <Hero />
        <Stats />
        <Calculator />
        <Flow />
        <Showcase />
        <Conversations />
        <Results />
        <Offer />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
