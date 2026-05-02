"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Home,
  Loader2,
  MapPin,
  Phone,
  Sprout,
  Timer,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { brazilianStates, getIbgeCitiesUrl, type BrazilianStateCode, type IbgeCity } from "@/lib/ibge";
import { cn } from "@/lib/utils";
import {
  buildClientSolarWhatsAppMessage,
  buildSellerSolarWhatsAppMessage,
  buildSolarLeadWhatsAppHref,
  calculateSolarSavings,
  formatCurrency,
  formatPhoneInput,
  getCommercialActionPlan,
  getLeadTemperature,
  monthlyBillOptions,
  propertyOwnershipOptions,
  propertyTypeOptions,
  purchaseTimelineOptions,
  sanitizeLeadInput,
  sanitizeLeadText,
  type PropertyOwnership,
  type PropertyType,
  type PurchaseTimeline,
  type SolarCalculatorLead,
} from "@/lib/solar-savings";

type SolarSavingsCalculatorProps = {
  companyPhone?: string;
  className?: string;
};

type BillChoice = string | "custom";

type FormState = {
  billChoice: BillChoice;
  monthlyBill: number;
  state: BrazilianStateCode | "";
  city: string;
  cityId: number | null;
  propertyType: PropertyType;
  propertyOwnership: PropertyOwnership;
  purchaseTimeline: PurchaseTimeline;
  name: string;
  phone: string;
};

type ResultStatus = "idle" | "loading" | "ready";
type ResultTab = "client" | "seller";

const defaultCompanyPhone = "5511945207618";
const minBill = 150;
const maxBill = 50000;
const maxCitySuggestions = 8;

const initialForm: FormState = {
  billChoice: "800",
  monthlyBill: 800,
  state: "",
  city: "",
  cityId: null,
  propertyType: "Casa",
  propertyOwnership: "Sim",
  purchaseTimeline: "Nos próximos 30 dias",
  name: "",
  phone: "",
};

const steps = [
  { key: "bill", title: "Conta", icon: CircleDollarSign },
  { key: "city", title: "Local", icon: MapPin },
  { key: "property", title: "Imóvel", icon: Home },
  { key: "ownership", title: "Perfil", icon: Building2 },
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
const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function SolarSavingsCalculator({
  companyPhone = defaultCompanyPhone,
  className,
}: SolarSavingsCalculatorProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [attemptedStep, setAttemptedStep] = useState<number | null>(null);
  const [cities, setCities] = useState<IbgeCity[]>([]);
  const [cityOpen, setCityOpen] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityError, setCityError] = useState("");
  const [resultStatus, setResultStatus] = useState<ResultStatus>("idle");
  const [resultLead, setResultLead] = useState<SolarCalculatorLead | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<ResultTab>("client");
  const cityCacheRef = useRef<Partial<Record<BrazilianStateCode, IbgeCity[]>>>({});
  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);

  const currentStep = steps[step];
  const CurrentIcon = currentStep.icon;
  const currentErrors = getStepErrors(step, form, cityError);
  const showCurrentErrors = attemptedStep === step;
  const canGoNext = currentErrors.length === 0;
  const progress = ((step + 1) / steps.length) * 100;
  const lead = resultLead ?? toSolarLead(form);
  const showResultPanel = resultStatus !== "idle";
  const resultEstimate = lead ? calculateSolarSavings(lead.monthlyBill) : null;
  const resultTemperature = lead ? getLeadTemperature(lead) : null;
  const clientMessage = lead ? buildClientSolarWhatsAppMessage(lead) : "";
  const sellerMessage = lead ? buildSellerSolarWhatsAppMessage(lead) : "";
  const whatsappHref = lead ? buildSolarLeadWhatsAppHref(companyPhone, lead) : "#";

  const citySuggestions = useMemo(() => {
    const query = normalizeSearch(form.city);

    if (!form.state || cityLoading) {
      return [];
    }

    if (!query) {
      return cities.slice(0, maxCitySuggestions);
    }

    return cities
      .filter((city) => normalizeSearch(city.nome).includes(query))
      .slice(0, maxCitySuggestions);
  }, [cities, cityLoading, form.city, form.state]);

  useEffect(() => {
    if (!form.state) return;

    const cached = cityCacheRef.current[form.state];
    if (cached) {
      queueMicrotask(() => {
        setCities(cached);
        setCityError("");
        setCityLoading(false);
      });
      return;
    }

    const controller = new AbortController();
    setCityLoading(true);
    setCityError("");

    fetch(getIbgeCitiesUrl(form.state), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Não foi possível buscar as cidades do IBGE.");
        }
        return response.json() as Promise<IbgeCity[]>;
      })
      .then((data) => {
        const safeCities = data
          .filter((city) => Number.isFinite(city.id) && typeof city.nome === "string")
          .map((city) => ({ id: city.id, nome: sanitizeLeadText(city.nome, 60) }));

        cityCacheRef.current[form.state as BrazilianStateCode] = safeCities;
        setCities(safeCities);
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          setCities([]);
          setCityError("Não foi possível carregar as cidades. Tente selecionar a UF novamente.");
        }
      })
      .finally(() => setCityLoading(false));

    return () => controller.abort();
  }, [form.state]);

  useEffect(() => {
    return () => {
      if (resultTimerRef.current) {
        clearTimeout(resultTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cardRef.current?.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [step]);

  const resetResult = () => {
    if (resultTimerRef.current) {
      clearTimeout(resultTimerRef.current);
      resultTimerRef.current = null;
    }
    setResultStatus("idle");
    setResultLead(null);
  };

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    resetResult();
    setForm((current) => ({ ...current, [key]: value }));
  };

  const goNext = () => {
    if (!canGoNext) {
      setAttemptedStep(step);
      return;
    }

    setAttemptedStep(null);
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => {
    setAttemptedStep(null);
    setStep((current) => Math.max(current - 1, 0));
  };

  const generateResult = () => {
    const invalidStep = steps.findIndex((_, index) => getStepErrors(index, form, cityError).length > 0);

    if (invalidStep >= 0) {
      setStep(invalidStep);
      setAttemptedStep(invalidStep);
      return;
    }

    const nextLead = toSolarLead(form);
    if (!nextLead) return;

    setResultLead(nextLead);
    setActiveResultTab("client");
    setResultStatus("loading");

    resultTimerRef.current = setTimeout(() => {
      setResultStatus("ready");
      resultTimerRef.current = null;
    }, 1250);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative mx-auto grid scroll-mt-28 overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_-24px_rgba(11,60,93,0.22),0_0_0_1px_var(--color-gray-200)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        showResultPanel
          ? "max-w-[1180px] grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]"
          : "max-w-[880px] grid-cols-1",
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
            <h3 className="max-w-[540px] text-2xl text-gray-900 sm:text-3xl">
              Simule a jornada que educa o cliente e prepara sua equipe.
            </h3>
            <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-gray-600">
              Demo B2B: veja o que o cliente recebe e o contexto comercial que chega no seu
              WhatsApp.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Sua marca", "Seu WhatsApp", "Sua região", "Suas regras"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-solar/15 bg-solar-soft/70 px-3 py-1 text-xs font-bold text-solar"
                >
                  {label}
                </span>
              ))}
            </div>
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
              const canVisit = index <= step;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    if (canVisit) setStep(index);
                  }}
                  disabled={!canVisit}
                  className={cn(
                    "flex h-11 items-center justify-center rounded-xl border text-gray-400 transition-all duration-200",
                    isActive &&
                      "scale-[1.02] border-solar bg-solar text-white shadow-[0_10px_22px_-12px_rgba(255,107,0,0.65)]",
                    isDone && "border-solar/30 bg-solar-soft text-solar",
                    !isActive && !isDone && "border-gray-200 bg-white",
                    canVisit && !isActive && "cursor-pointer hover:border-gray-300 hover:bg-gray-50",
                    !canVisit && "cursor-not-allowed opacity-50",
                  )}
                  aria-label={item.title}
                >
                  {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-[250px] sm:min-h-[280px]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-deep-soft text-deep">
              <CurrentIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                {currentStep.title}
              </div>
              <QuestionTitle step={step} />
            </div>
          </div>

          <StepContent
            step={step}
            form={form}
            cityOpen={cityOpen}
            cityLoading={cityLoading}
            citySuggestions={citySuggestions}
            errors={showCurrentErrors ? currentErrors : []}
            updateForm={updateForm}
            setCityOpen={setCityOpen}
            onStateChangeReset={(hasState) => {
              setCities([]);
              setCityError("");
              setCityLoading(hasState);
            }}
          />
        </div>

        <div className="mt-7 flex items-center justify-between gap-3 border-t border-gray-200 pt-5">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 font-heading text-sm font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-solar px-5 font-heading text-sm font-bold text-white shadow-[0_10px_22px_-12px_rgba(255,107,0,0.65)] transition-all hover:-translate-y-0.5 hover:bg-solar-deep active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={generateResult}
              disabled={!canGoNext || resultStatus === "loading"}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-whatsapp px-5 font-heading text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(37,211,102,0.7)] transition-all hover:-translate-y-0.5 hover:bg-whatsapp-deep active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45"
            >
              {resultStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" fill="currentColor" />
              )}
              Gerar simulação
            </button>
          )}
        </div>

      </div>

      {showResultPanel && (
        <ResultPanel
          status={resultStatus}
          lead={lead}
          estimate={resultEstimate}
          temperature={resultTemperature}
          activeTab={activeResultTab}
          clientMessage={clientMessage}
          sellerMessage={sellerMessage}
          whatsappHref={whatsappHref}
          onTabChange={setActiveResultTab}
        />
      )}
    </div>
  );
}

function QuestionTitle({ step }: { step: number }) {
  const titles = [
    "Quanto você paga em média na conta de luz?",
    "Onde fica o imóvel?",
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
  cityOpen,
  cityLoading,
  citySuggestions,
  errors,
  updateForm,
  setCityOpen,
  onStateChangeReset,
}: {
  step: number;
  form: FormState;
  cityOpen: boolean;
  cityLoading: boolean;
  citySuggestions: IbgeCity[];
  errors: string[];
  updateForm: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  setCityOpen: (open: boolean) => void;
  onStateChangeReset: (hasState: boolean) => void;
}) {
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const safeActiveCityIndex =
    citySuggestions.length === 0 ? 0 : Math.min(activeCityIndex, citySuggestions.length - 1);

  const selectCity = (city: IbgeCity) => {
    updateForm("city", city.nome);
    updateForm("cityId", city.id);
    setCityOpen(false);
  };

  const handleCityKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!form.state) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCityOpen(true);
      setActiveCityIndex((current) =>
        citySuggestions.length === 0 ? 0 : Math.min(current + 1, citySuggestions.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setCityOpen(true);
      setActiveCityIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      const activeCity = citySuggestions[safeActiveCityIndex] ?? citySuggestions[0];

      if (cityOpen && activeCity) {
        event.preventDefault();
        selectCity(activeCity);
      }
      return;
    }

    if (event.key === "Escape") {
      setCityOpen(false);
    }
  };

  if (step === 0) {
    return (
      <div className="calc-step-enter">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {monthlyBillOptions.map((option) => {
            const active = form.billChoice === String(option.value);

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  updateForm("billChoice", String(option.value));
                  updateForm("monthlyBill", option.value);
                }}
                className={cn(
                  "relative min-h-16 cursor-pointer rounded-2xl border-2 px-4 text-left font-heading text-lg font-bold transition-all duration-200 active:scale-[0.98]",
                  active
                    ? "border-solar bg-solar text-white shadow-[0_14px_30px_-14px_rgba(255,107,0,0.72)]"
                    : "border-gray-200 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-solar/60 hover:shadow-[0_12px_28px_-20px_rgba(11,60,93,0.45)]",
                )}
              >
                {option.label}
                {active && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              updateForm("billChoice", "custom");
              updateForm("monthlyBill", 0);
            }}
            className={cn(
              "relative min-h-16 cursor-pointer rounded-2xl border-2 px-4 text-left font-heading text-lg font-bold transition-all duration-200 active:scale-[0.98]",
              form.billChoice === "custom"
                ? "border-solar bg-solar text-white shadow-[0_14px_30px_-14px_rgba(255,107,0,0.72)]"
                : "border-gray-200 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-solar/60 hover:shadow-[0_12px_28px_-20px_rgba(11,60,93,0.45)]",
            )}
          >
            Outro valor
            {form.billChoice === "custom" && (
              <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2" />
            )}
          </button>
        </div>

        {form.billChoice === "custom" && (
          <label className="mt-4 block calc-step-enter">
            <span className="mb-2 block text-sm font-semibold text-gray-600">Valor mensal</span>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading text-lg font-bold text-gray-400">
                R$
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={formatBillInput(form.monthlyBill)}
                onChange={(event) => updateForm("monthlyBill", parseBillInput(event.target.value))}
                maxLength={7}
                aria-invalid={errors.length > 0}
                placeholder="2.500"
                className="h-[54px] w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 font-heading text-lg font-bold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-solar focus:bg-white focus:ring-4 focus:ring-solar/12"
              />
            </div>
          </label>
        )}

        <FieldErrors errors={errors} />
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="grid gap-4 calc-step-enter">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-600">Estado (UF)</span>
          <div className="relative">
            <select
              value={form.state}
              onChange={(event) => {
                updateForm("state", event.target.value as BrazilianStateCode | "");
                updateForm("city", "");
                updateForm("cityId", null);
                onStateChangeReset(Boolean(event.target.value));
                setActiveCityIndex(0);
                setCityOpen(false);
              }}
              aria-invalid={errors.some((error) => error.includes("UF"))}
              className="h-14 w-full cursor-pointer appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 pr-12 font-heading text-lg font-bold text-gray-900 outline-none transition focus:border-solar focus:bg-white focus:ring-4 focus:ring-solar/12"
            >
              <option value="">Selecione a UF</option>
              {brazilianStates.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.code} - {state.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </label>

        <div className="relative">
          <label htmlFor="solar-city" className="mb-2 block text-sm font-semibold text-gray-600">
            Cidade
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="solar-city"
              type="text"
              role="combobox"
              aria-expanded={cityOpen}
              aria-controls="solar-city-suggestions"
              aria-autocomplete="list"
              aria-activedescendant={
                cityOpen && citySuggestions[safeActiveCityIndex]
                  ? `solar-city-option-${citySuggestions[safeActiveCityIndex].id}`
                  : undefined
              }
              value={form.city}
              onFocus={() => {
                if (form.state) setCityOpen(true);
              }}
              onKeyDown={handleCityKeyDown}
              onChange={(event) => {
                updateForm("city", sanitizeLeadInput(event.target.value, 60));
                updateForm("cityId", null);
                setActiveCityIndex(0);
                setCityOpen(true);
              }}
              disabled={!form.state}
              maxLength={60}
              placeholder={form.state ? "Digite para buscar a cidade" : "Selecione a UF primeiro"}
              className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 font-heading text-lg font-bold text-gray-900 outline-none transition placeholder:font-sans placeholder:text-base placeholder:font-medium placeholder:text-gray-400 focus:border-solar focus:bg-white focus:ring-4 focus:ring-solar/12 disabled:cursor-not-allowed disabled:opacity-60"
            />
            {cityLoading && (
              <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-solar" />
            )}
          </div>

          {cityOpen && form.state && !cityLoading && (
            <div
              id="solar-city-suggestions"
              role="listbox"
              className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_20px_50px_-24px_rgba(11,60,93,0.45)]"
            >
              {citySuggestions.length > 0 ? (
                citySuggestions.map((city) => (
                  <button
                    key={city.id}
                    id={`solar-city-option-${city.id}`}
                    type="button"
                    role="option"
                    aria-selected={form.cityId === city.id}
                    onMouseEnter={() =>
                      setActiveCityIndex(citySuggestions.findIndex((item) => item.id === city.id))
                    }
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectCity(city);
                    }}
                    onClick={() => selectCity(city)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-700 transition",
                      citySuggestions[safeActiveCityIndex]?.id === city.id
                        ? "bg-solar-soft text-solar"
                        : "hover:bg-solar-soft hover:text-solar",
                    )}
                  >
                    <span>{city.nome}</span>
                    {form.cityId === city.id && <Check className="h-4 w-4" />}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500">
                  Nenhuma cidade encontrada nessa UF.
                </div>
              )}
            </div>
          )}

          <p className="mt-2 text-xs font-medium text-gray-500">
            Lista carregada da API oficial de Localidades do IBGE.
          </p>
        </div>

        <FieldErrors errors={errors} />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="calc-step-enter">
        <OptionGrid
          options={propertyTypeOptions}
          value={form.propertyType}
          onChange={(value) => updateForm("propertyType", value)}
          iconMap={propertyIcons}
        />
        <FieldErrors errors={errors} />
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="calc-step-enter">
        <OptionGrid
          options={propertyOwnershipOptions}
          value={form.propertyOwnership}
          onChange={(value) => updateForm("propertyOwnership", value)}
        />
        <FieldErrors errors={errors} />
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="calc-step-enter">
        <OptionGrid
          options={purchaseTimelineOptions}
          value={form.purchaseTimeline}
          onChange={(value) => updateForm("purchaseTimeline", value)}
        />
        <FieldErrors errors={errors} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 calc-step-enter">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-600">Nome</span>
        <div className="relative">
          <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateForm("name", sanitizeLeadInput(event.target.value, 60))}
            placeholder="Seu nome"
            autoComplete="name"
            maxLength={60}
            aria-invalid={errors.some((error) => error.includes("nome"))}
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
            onChange={(event) => updateForm("phone", formatPhoneInput(event.target.value))}
            placeholder="(11) 99999-9999"
            autoComplete="tel-national"
            inputMode="tel"
            maxLength={15}
            aria-invalid={errors.some((error) => error.includes("WhatsApp"))}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 font-heading text-lg font-bold text-gray-900 outline-none transition placeholder:font-sans placeholder:text-base placeholder:font-medium placeholder:text-gray-400 focus:border-solar focus:bg-white focus:ring-4 focus:ring-solar/12"
          />
        </div>
      </label>
      <FieldErrors errors={errors} />
    </div>
  );
}

function ResultPanel({
  status,
  lead,
  estimate,
  temperature,
  activeTab,
  clientMessage,
  sellerMessage,
  whatsappHref,
  onTabChange,
}: {
  status: ResultStatus;
  lead: SolarCalculatorLead | null;
  estimate: ReturnType<typeof calculateSolarSavings> | null;
  temperature: ReturnType<typeof getLeadTemperature> | null;
  activeTab: ResultTab;
  clientMessage: string;
  sellerMessage: string;
  whatsappHref: string;
  onTabChange: (tab: ResultTab) => void;
}) {
  return (
    <aside className="relative overflow-hidden bg-[linear-gradient(135deg,#0B3C5D_0%,#082C44_62%,#061F31_100%)] p-5 text-white calc-result-enter sm:p-7 lg:p-9">
      <div aria-hidden className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-solar/20 blur-3xl" />
      <div aria-hidden className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-whatsapp/12 blur-3xl" />

      <div className="relative">
        <div className="mb-5 overflow-hidden rounded-3xl border border-white/10 bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="relative aspect-[16/9]">
            <Image
              src="/solarcalc-calculator-visual.jpg"
              alt="Telhado com placas solares e balões de mensagens representando leads qualificados"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 520px, 100vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-2/90 via-deep-2/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/12 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white/78 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-whatsapp dot-ping" />
                  Resultado gerado
                </span>
                <h4 className="mt-3 text-2xl text-white">Simulação pronta</h4>
              </div>
              {temperature && (
                <span className="rounded-full bg-solar px-3 py-1.5 text-xs font-bold text-white">
                  {temperature.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {status === "loading" && <LoadingResult />}

        {status === "ready" && lead && estimate && temperature && (
          <div className="calc-step-enter">
            <div className="mb-5 grid grid-cols-2 gap-3">
              <Metric label="Economia mensal" value={`${formatCurrency(estimate.monthlySavings)}`} />
              <Metric label="Payback" value={`~${estimate.paybackYears} anos`} />
              <Metric label="Sistema" value={`${estimate.estimatedSystemKwp} kWp`} />
              <Metric label="Investimento" value={`~${formatCurrency(estimate.estimatedInvestment)}`} />
            </div>

            <div className="mb-4 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/8 p-1">
              <ResultTabButton active={activeTab === "client"} onClick={() => onTabChange("client")}>
                Cliente
              </ResultTabButton>
              <ResultTabButton active={activeTab === "seller"} onClick={() => onTabChange("seller")}>
                Equipe comercial
              </ResultTabButton>
            </div>

            {activeTab === "client" ? (
              <ClientPreview lead={lead} message={clientMessage} />
            ) : (
              <SellerPreview lead={lead} estimate={estimate} temperature={temperature} message={sellerMessage} />
            )}

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta mt-5 inline-flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-whatsapp px-5 font-heading text-sm font-bold text-white shadow-[0_12px_26px_-14px_rgba(37,211,102,0.8)] transition-all hover:-translate-y-0.5 hover:bg-whatsapp-deep active:scale-[0.98]"
            >
              <Zap className="h-4 w-4" fill="currentColor" />
              Simular recebimento no WhatsApp
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}

function LoadingResult() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] calc-step-enter">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-solar text-white shadow-[0_16px_30px_-18px_rgba(255,107,0,0.85)]">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <div>
          <div className="font-heading text-lg font-bold text-white">Calculando simulação</div>
          <div className="text-sm text-white/58">Montando mensagens para cliente e vendedor.</div>
        </div>
      </div>
      <div className="space-y-3">
        {["Estimando economia mensal", "Qualificando intenção de compra", "Preparando template do WhatsApp"].map(
          (label, index) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/7 px-4 py-3">
              <span
                className="h-2.5 w-2.5 rounded-full bg-whatsapp calc-loading-dot"
                style={{ animationDelay: `${index * 130}ms` }}
              />
              <span className="text-sm font-semibold text-white/76">{label}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function ClientPreview({ lead, message }: { lead: SolarCalculatorLead; message: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#ece5dd] text-gray-900 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-3 bg-whatsapp px-4 py-3 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/18 font-heading font-bold">
          {lead.name.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <div className="font-heading text-sm font-bold">Mensagem automática para cliente</div>
          <div className="text-xs text-white/74">{lead.city}/{lead.state} · orçamento inicial</div>
        </div>
      </div>
      <div className="wpp-pattern p-4">
        <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed shadow-sm">
          {message.split("\n").map((line, index) => (
            <span key={`${line}-${index}`}>
              {line || "\u00a0"}
              <br />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SellerPreview({
  lead,
  estimate,
  temperature,
  message,
}: {
  lead: SolarCalculatorLead;
  estimate: ReturnType<typeof calculateSolarSavings>;
  temperature: ReturnType<typeof getLeadTemperature>;
  message: string;
}) {
  const actionPlan = getCommercialActionPlan(lead);
  const details = [
    ["Cliente", lead.name],
    ["WhatsApp", lead.phone],
    ["Local", `${lead.city}/${lead.state}`],
    ["Conta", `${formatCurrency(estimate.monthlyBill)}/mês`],
    ["Imóvel", lead.propertyType],
    ["Prazo", lead.purchaseTimeline],
  ];
  const commercialCards = [
    ["Prioridade", `${actionPlan.priority} · ${actionPlan.responseWindow}`],
    ["Abordagem", actionPlan.suggestedApproach],
    ["Objeção provável", actionPlan.likelyObjection],
    ["Próxima ação", actionPlan.nextAction],
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-solar text-white">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="font-heading text-base font-bold text-white">
              Como chega para sua equipe comercial
            </div>
            <div className="text-xs text-white/54">
              Lead com contexto, prioridade e próximo passo sugerido.
            </div>
          </div>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/76">
          {temperature.label}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {details.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white/7 px-3 py-2.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/42">{label}</div>
            <div className="mt-1 text-sm font-semibold text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 grid gap-2">
        {commercialCards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-[#071f32]/80 px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-solar/90">
              {label}
            </div>
            <div className="mt-1 text-sm font-semibold leading-relaxed text-white/82">{value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#071f32] p-4">
        <div className="mb-2 flex items-center gap-2 font-heading text-sm font-bold text-white">
          <ClipboardList className="h-4 w-4 text-solar" />
          Resumo enviado no WhatsApp
        </div>
        <pre className="max-h-52 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-white/66">
          {message}
        </pre>
      </div>
    </div>
  );
}

function ResultTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      onClick={onClick}
      className={cn(
        "h-11 rounded-xl font-heading text-sm font-bold transition-all active:scale-[0.98]",
        active ? "bg-white text-deep shadow-sm" : "text-white/60 hover:bg-white/8 hover:text-white",
      )}
    >
      {children}
    </button>
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
              "relative flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 text-left font-heading text-base font-bold transition-all duration-200 active:scale-[0.98]",
              active
                ? "border-solar bg-solar text-white shadow-[0_14px_30px_-14px_rgba(255,107,0,0.72)]"
                : "border-gray-200 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-solar/60 hover:shadow-[0_12px_28px_-20px_rgba(11,60,93,0.45)]",
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

function FieldErrors({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;

  return (
    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
      {errors.map((error) => (
        <div key={error}>{error}</div>
      ))}
    </div>
  );
}

function getStepErrors(step: number, form: FormState, cityError = "") {
  const errors: string[] = [];

  if (step === 0) {
    if (!Number.isFinite(form.monthlyBill) || form.monthlyBill < minBill) {
      errors.push(`Informe uma conta acima de ${formatCurrency(minBill)}.`);
    }
    if (form.monthlyBill > maxBill) {
      errors.push(`Use um valor até ${formatCurrency(maxBill)} para manter a simulação comercial.`);
    }
  }

  if (step === 1) {
    if (!form.state) {
      errors.push("Selecione a UF do imóvel.");
    }
    if (cityError) {
      errors.push(cityError);
    }
    if (form.state && (!form.city || !form.cityId)) {
      errors.push("Escolha uma cidade da lista do IBGE.");
    }
  }

  if (step === 5) {
    if (sanitizeLeadText(form.name, 60).length < 2) {
      errors.push("Informe o nome do lead.");
    }
    const phoneDigits = onlyDigits(form.phone);
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      errors.push("Informe um WhatsApp com DDD.");
    }
  }

  return errors;
}

function toSolarLead(form: FormState): SolarCalculatorLead | null {
  if (!form.state || !form.cityId) return null;

  return {
    monthlyBill: form.monthlyBill,
    city: sanitizeLeadText(form.city, 60),
    state: form.state,
    cityId: form.cityId,
    propertyType: form.propertyType,
    propertyOwnership: form.propertyOwnership,
    purchaseTimeline: form.purchaseTimeline,
    name: sanitizeLeadText(form.name, 60),
    phone: formatPhoneInput(form.phone),
  };
}

function parseBillInput(value: string) {
  const digits = onlyDigits(value).slice(0, 6);
  const amount = Number(digits || 0);

  return Math.min(amount, maxBill);
}

function formatBillInput(value: number) {
  if (!value) return "";
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(value);
}
