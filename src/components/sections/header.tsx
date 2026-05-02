"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { CtaButton } from "@/components/cta-button";
import { cn } from "@/lib/utils";
import { whatsappHref } from "@/lib/whatsapp";

const links = [
  { href: "#funciona", label: "Como funciona" },
  { href: "#calc-demo", label: "Calculadora" },
  { href: "#prova", label: "Prova" },
  { href: "#preco", label: "Preço" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent backdrop-blur-md transition-[border-color,background,box-shadow] duration-300",
        scrolled
          ? "border-gray-200 bg-white/95 shadow-[0_1px_0_rgba(11,60,93,0.04)]"
          : "bg-white/85",
      )}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[15px] font-medium text-gray-700 transition-colors hover:text-deep"
            >
              {l.label}
            </a>
          ))}
          <CtaButton
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="wpp"
            size="sm"
            className="group/cta"
          >
            Falar no WhatsApp
          </CtaButton>
        </nav>
      </div>
    </header>
  );
}
