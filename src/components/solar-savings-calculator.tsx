"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleDollarSign,
  Home,
  MapPin,
  Phone,
  Sprout,
  Timer,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildSolarLeadWhatsAppHref,
  calculateSolarSavings,
  formatCurrency,
  getLeadTemperature,
  monthlyBillOptions,
  propertyOwnershipOptions,
  propertyTypeOptions,
  purchaseTimelineOptions,
  type PropertyOwnership,
  type PropertyType,
  type PurchaseTimeline,
  type SolarCalculatorLead,
} from "@/lib/solar-savings";

type SolarSavingsCalculatorProps = {
  companyPhone?: string;
  className?: string;
};

type FormState = {
  monthlyBill: number;
  city: string;
  propertyType: PropertyType;
  propertyOwnership: PropertyOwnership;
  purchaseTimeline: PurchaseTimeline;
  name: string;
  phone: string;
};

const defaultCompanyPhone = "5511945207618";

const initialForm: FormState = {
  monthlyBill: 800,
  city: "",
  propertyType: "Casa",
  propertyOwnership: "Sim",
  purchaseTimeline: "Nos próximos 30 dias",
  name: "",
  phone: "",
};

const steps = [
  { key: "bill", title: "Conta de energia", icon: CircleDollarSign },
  { key: "city", title: "Cidade", icon: MapPin },
  { key: "property", title: "Imóvel", icon: Home },
  { key: "ownership", title: "Situação", icon: Building2 },
  { key: "timeline", title: "Momento", icon: Timer },
  { key: "contact", title: "Contato", icon: Phone },
] as const;

const propertyIcons: Record<PropertyType, LucideIcon> = {
  Casa: Home,
  Comércio: Building2,
  Empresa: Building2,
  "Fazenda / Sítio": Sprout,
  Indústria: Building2,
};

const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function SolarSavingsCalculator({
  companyPhone = defaultCompanyPhone,
  className,
}: SolarSavingsCalculatorProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const estimate = useMemo(() => calculateSolarSavings(form.monthlyBill), [form.monthlyBill]);
  const leadTemperature = getLeadTemperature(form);

  const progress = ((step + 1) / steps.length) * 100;
  const currentStep = steps[step];
  const canGoNext = isStepValid(step, form);
  const isComplete = steps.every((_, index) => isStepValid(index, form));
  const whatsappHref = isComplete
    ? buildSolarLeadWhatsAppHref(companyPhone, form as SolarCalculatorLead)
    : "#";

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const goNext = () => {
    if (!canGoNext) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  return (
    <div
      className={cn(
        "relative mx-auto grid max-w-[1120px] grid-cols-1 overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_-24px_rgba(11,60,93,0.22),0_0_0_1px_var(--color-gray-200)] lg:grid-cols-[1.02fr_0.98fr]",
        className,
      )}
    >
      <div className="relative p-5 sm:p-7 lg:p-9">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-solar-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-solar">
              <span className="h-1.5 w-1.5 rounded-full bg-solar dot-ping" />
              Simulador de Economia Solar
            </span>
            <h3 className="max-w-[520px] text-2xl text-gray-900 sm:text-3xl">
              Descubra o potencial comercial do seu lead.
            </h3>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-right">
            <div className="font-heading text-xl font-extrabold leading-none text-solar">
              {step + 1}/{steps.length}
            </div>
            <div className="mt-1 text-xs font-semibold text-gray-500">etapas</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#FF6B00_0%,#FF9B54_100%)] transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === step;
              const isDone = index < step;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setStep(index)}
                  className={cn(
                    "flex h-11 items-center justify-center rounded-xl border text-gray-400 transition-all",
                    isActive &&
                      "border-solar bg-solar text-white shadow-[0_10px_22px_-12px_rgba(255,107,0,0.65)]",
                    isDone && "border-solar/30 bg-solar-soft text-solar",
                    !isActive && !isDone && "border-gray-200 bg-white hover:border-gray-300",
                  )}
                  aria-label={item.title}
                >
                  {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-[300px]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-deep-soft text-deep">
              <currentStep.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                {currentStep.title}
              </div>
              <QuestionTitle step={step} />
            </div>
          </div>

          <StepContent step={step} form={form} updateForm={updateForm} />
        </div>

        <div className="mt-7 flex items-center justify-between gap-3 border-t border-gray-200 pt-5">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 font-heading text-sm font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-solar px-5 font-heading text-sm font-bold text-white shadow-[0_10px_22px_-12px_rgba(255,107,0,0.65)] transition-all hover:-translate-y-0.5 hover:bg-solar-deep disabled:pointer-events-none disabled:opacity-45"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <a
              href={whatsappHref}
              target={isComplete ? "_blank" : undefined}
              rel={isComplete ? "noopener noreferrer" : undefined}
              aria-disabled={!isComplete}
              onClick={(event) => {
                if (!isComplete) event.preventDefault();
              }}
              className={cn(
                "group/cta inline-flex h-12 items-center gap-2 overflow-hidden rounded-xl bg-whatsapp px-5 font-heading text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(37,211,102,0.7)] transition-all hover:-translate-y-0.5 hover:bg-whatsapp-deep",
                !isComplete && "pointer-events-none opacity-45",
              )}
            >
              <Zap className="h-4 w-4" fill="currentColor" />
              Enviar no WhatsApp
            </a>
          )}
        </div>
      </div>

      <aside className="relative overflow-hidden bg-[linear-gradient(135deg,#0B3C5D_0%,#082C44_62%,#061F31_100%)] p-5 text-white sm:p-7 lg:p-9">
        <div
          aria-hidden
          className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-solar/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-whatsapp/12 blur-3xl"
        />

        <div className="relative flex h-full flex-col">
          <div className="mb-8 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white/72">
              <span className="h-1.5 w-1.5 rounded-full bg-whatsapp dot-ping" />
              Resultado ao vivo
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/72">
              {leadTemperature.label}
            </span>
          </div>

          <div className="mb-7">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/58">
              Você pode economizar até
            </div>
            <div
              key={estimate.monthlySavings}
              className="font-heading value-bump text-[clamp(3rem,7vw,5rem)] font-extrabold leading-none text-solar"
            >
              {formatCurrency(estimate.monthlySavings)}
              <span className="text-[0.42em] text-solar/90">/mês</span>
            </div>
            <p className="mt-3 text-base text-white/74">
              {formatCurrency(estimate.yearlySavings)}/ano estimados com até{" "}
              {estimate.annualEconomyPercent}% de redução na conta.
            </p>
          </div>

          <div className="mb-7 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#FF6B00_0%,#FFB06F_100%)] transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${estimate.annualEconomyPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Metric label="Sistema" value={`${estimate.estimatedSystemKwp} kWp`} />
            <Metric label="Payback" value={`~${estimate.paybackYears} anos`} />
            <Metric label="Conta atual" value={formatCurrency(estimate.monthlyBill)} />
            <Metric label="Investimento" value={`~${formatCurrency(estimate.estimatedInvestment)}`} />
          </div>

          <div className="mt-7 rounded-2xl border border-white/10 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="mb-2 font-heading text-sm font-bold text-white">
              {leadTemperature.description}
            </div>
            <div className="text-sm leading-relaxed text-white/64">
              {form.city ? `${form.propertyType} em ${form.city}` : form.propertyType} ·{" "}
              {form.purchaseTimeline.toLowerCase()} · conta de {formatCurrency(form.monthlyBill)}.
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function QuestionTitle({ step }: { step: number }) {
  const titles = [
    "Quanto você paga em média na conta de luz?",
    "Em qual cidade fica o imóvel?",
    "Onde seria a instalação?",
    "O imóvel é próprio?",
    "Quando você pretende instalar energia solar?",
    "Para receber sua simulação, informe seus dados.",
  ];

  return <h4 className="mt-1 text-xl text-gray-900">{titles[step]}</h4>;
}

function StepContent({
  step,
  form,
  updateForm,
}: {
  step: number;
  form: FormState;
  updateForm: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  if (step === 0) {
    return (
      <div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {monthlyBillOptions.map((option) => {
            const active = form.monthlyBill === option.value;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => updateForm("monthlyBill", option.value)}
                className={cn(
                  "relative min-h-16 rounded-2xl border-2 px-4 text-left font-heading text-lg font-bold transition-all",
                  active
                    ? "border-solar bg-solar text-white shadow-[0_12px_28px_-14px_rgba(255,107,0,0.7)]"
                    : "border-gray-200 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-solar/60",
                )}
              >
                {option.label}
                {active && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2" />}
              </button>
            );
          })}
        </div>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-semibold text-gray-600">Outro valor</span>
          <input
            type="number"
            min={150}
            step={50}
            value={form.monthlyBill}
            onChange={(event) => updateForm("monthlyBill", Number(event.target.value))}
            className="h-[52px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 font-heading text-lg font-bold text-gray-900 outline-none transition focus:border-solar focus:bg-white focus:ring-4 focus:ring-solar/12"
            inputMode="numeric"
          />
        </label>
      </div>
    );
  }

  if (step === 1) {
    return (
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-600">Cidade e estado</span>
        <input
          type="text"
          value={form.city}
          onChange={(event) => updateForm("city", event.target.value)}
          placeholder="Ex: Campinas, SP"
          className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 font-heading text-lg font-bold text-gray-900 outline-none transition placeholder:font-sans placeholder:text-base placeholder:font-medium placeholder:text-gray-400 focus:border-solar focus:bg-white focus:ring-4 focus:ring-solar/12"
        />
      </label>
    );
  }

  if (step === 2) {
    return (
      <OptionGrid
        options={propertyTypeOptions}
        value={form.propertyType}
        onChange={(value) => updateForm("propertyType", value)}
        iconMap={propertyIcons}
      />
    );
  }

  if (step === 3) {
    return (
      <OptionGrid
        options={propertyOwnershipOptions}
        value={form.propertyOwnership}
        onChange={(value) => updateForm("propertyOwnership", value)}
      />
    );
  }

  if (step === 4) {
    return (
      <OptionGrid
        options={purchaseTimelineOptions}
        value={form.purchaseTimeline}
        onChange={(value) => updateForm("purchaseTimeline", value)}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-600">Nome</span>
        <div className="relative">
          <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateForm("name", event.target.value)}
            placeholder="Seu nome"
            className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 font-heading text-lg font-bold text-gray-900 outline-none transition placeholder:font-sans placeholder:text-base placeholder:font-medium placeholder:text-gray-400 focus:border-solar focus:bg-white focus:ring-4 focus:ring-solar/12"
          />
        </div>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-600">WhatsApp</span>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => updateForm("phone", event.target.value)}
            placeholder="(11) 99999-9999"
            className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 font-heading text-lg font-bold text-gray-900 outline-none transition placeholder:font-sans placeholder:text-base placeholder:font-medium placeholder:text-gray-400 focus:border-solar focus:bg-white focus:ring-4 focus:ring-solar/12"
          />
        </div>
      </label>
    </div>
  );
}

function OptionGrid<T extends string>({
  options,
  value,
  onChange,
  iconMap,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  iconMap?: Partial<Record<string, LucideIcon>>;
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {options.map((option) => {
        const active = option === value;
        const Icon = iconMap?.[option];

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "relative flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 text-left font-heading text-base font-bold transition-all",
              active
                ? "border-solar bg-solar text-white shadow-[0_12px_28px_-14px_rgba(255,107,0,0.7)]"
                : "border-gray-200 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-solar/60",
            )}
          >
            {Icon && (
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl",
                  active ? "bg-white/16 text-white" : "bg-solar-soft text-solar",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
            )}
            <span className="pr-7">{option}</span>
            {active && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2" />}
          </button>
        );
      })}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="text-xs font-semibold uppercase tracking-[0.08em] text-white/46">{label}</div>
      <div className="mt-2 font-heading text-lg font-extrabold text-white">{value}</div>
    </div>
  );
}

function isStepValid(step: number, form: FormState) {
  if (step === 0) return form.monthlyBill >= 150;
  if (step === 1) return form.city.trim().length >= 2;
  if (step === 5) return form.name.trim().length >= 2 && onlyDigits(form.phone).length >= 10;

  return true;
}
