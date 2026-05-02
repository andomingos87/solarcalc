export type PropertyType = "Casa" | "Comércio" | "Empresa" | "Fazenda / Sítio" | "Indústria";
export type PropertyOwnership = "Sim" | "Não" | "Estou avaliando para outra pessoa/empresa";
export type PurchaseTimeline =
  | "O quanto antes"
  | "Nos próximos 30 dias"
  | "Em até 3 meses"
  | "Só estou pesquisando";

export type SolarCalculatorLead = {
  monthlyBill: number;
  city: string;
  propertyType: PropertyType;
  propertyOwnership: PropertyOwnership;
  purchaseTimeline: PurchaseTimeline;
  name: string;
  phone: string;
};

export type SolarSavingsEstimate = {
  monthlyBill: number;
  monthlySavings: number;
  yearlySavings: number;
  annualEconomyPercent: number;
  estimatedSystemKwp: number;
  estimatedInvestment: number;
  paybackYears: number;
};

export const monthlyBillOptions = [
  { label: "Até R$ 300", value: 300 },
  { label: "R$ 301 a R$ 500", value: 500 },
  { label: "R$ 501 a R$ 800", value: 800 },
  { label: "R$ 801 a R$ 1.200", value: 1200 },
  { label: "Acima de R$ 1.200", value: 1500 },
] as const;

export const propertyTypeOptions: PropertyType[] = [
  "Casa",
  "Comércio",
  "Empresa",
  "Fazenda / Sítio",
  "Indústria",
];

export const propertyOwnershipOptions: PropertyOwnership[] = [
  "Sim",
  "Não",
  "Estou avaliando para outra pessoa/empresa",
];

export const purchaseTimelineOptions: PurchaseTimeline[] = [
  "O quanto antes",
  "Nos próximos 30 dias",
  "Em até 3 meses",
  "Só estou pesquisando",
];

const DEFAULT_ECONOMY_PERCENT = 0.92;
const DEFAULT_ENERGY_TARIFF = 0.96;
const DEFAULT_MONTHLY_GENERATION_PER_KWP = 160;
const DEFAULT_INVESTMENT_PER_KWP = 5100;

const roundCurrency = (value: number) => Math.round(value);
const roundOneDecimal = (value: number) => Math.round(value * 10) / 10;

export function calculateSolarSavings(monthlyBill: number): SolarSavingsEstimate {
  const bill = Math.max(0, roundCurrency(monthlyBill));
  const monthlySavings = roundCurrency(bill * DEFAULT_ECONOMY_PERCENT);
  const yearlySavings = monthlySavings * 12;
  const estimatedMonthlyKwh = bill / DEFAULT_ENERGY_TARIFF;
  const estimatedSystemKwp = roundOneDecimal(
    estimatedMonthlyKwh / DEFAULT_MONTHLY_GENERATION_PER_KWP,
  );
  const estimatedInvestment = roundCurrency(estimatedSystemKwp * DEFAULT_INVESTMENT_PER_KWP);
  const paybackYears = yearlySavings > 0 ? roundOneDecimal(estimatedInvestment / yearlySavings) : 0;

  return {
    monthlyBill: bill,
    monthlySavings,
    yearlySavings,
    annualEconomyPercent: Math.round(DEFAULT_ECONOMY_PERCENT * 100),
    estimatedSystemKwp,
    estimatedInvestment,
    paybackYears,
  };
}

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("55")) {
    return digits;
  }

  return `55${digits}`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\u00a0/g, " ");
}

export function getLeadTemperature(lead: Pick<SolarCalculatorLead, "monthlyBill" | "propertyOwnership" | "purchaseTimeline">) {
  const score =
    (lead.monthlyBill >= 800 ? 2 : lead.monthlyBill >= 500 ? 1 : 0) +
    (lead.propertyOwnership === "Sim" ? 2 : lead.propertyOwnership === "Não" ? 0 : 1) +
    (lead.purchaseTimeline === "O quanto antes" || lead.purchaseTimeline === "Nos próximos 30 dias"
      ? 2
      : lead.purchaseTimeline === "Em até 3 meses"
        ? 1
        : 0);

  if (score >= 5) {
    return {
      label: "Lead quente",
      description: "Conta alta, imóvel com boa chance de decisão e intenção próxima.",
    };
  }

  if (score >= 3) {
    return {
      label: "Lead em avaliação",
      description: "Perfil com potencial, bom para abordagem consultiva.",
    };
  }

  return {
    label: "Lead em nutrição",
    description: "Ainda pesquisando, vale educar antes da proposta.",
  };
}

export function buildSolarLeadWhatsAppHref(companyPhone: string, lead: SolarCalculatorLead) {
  const estimate = calculateSolarSavings(lead.monthlyBill);
  const temperature = getLeadTemperature(lead);
  const phone = normalizePhone(companyPhone);
  const message = [
    "Olá! Fiz uma simulação pela SolarCalc e quero receber um orçamento.",
    "",
    `Nome: ${lead.name}`,
    `WhatsApp: ${lead.phone}`,
    `Cidade: ${lead.city}`,
    `Conta de luz: ${formatCurrency(estimate.monthlyBill)}/mês`,
    `Economia estimada: ${formatCurrency(estimate.monthlySavings)}/mês (${formatCurrency(
      estimate.yearlySavings,
    )}/ano)`,
    `Sistema estimado: ${estimate.estimatedSystemKwp} kWp`,
    `Payback estimado: ${estimate.paybackYears} anos`,
    `Imóvel: ${lead.propertyType}`,
    `Imóvel próprio: ${lead.propertyOwnership}`,
    `Prazo de instalação: ${lead.purchaseTimeline}`,
    `Qualificação: ${temperature.label}`,
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
