import type { BrazilianStateCode } from "./ibge";

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
  state: BrazilianStateCode;
  cityId: number;
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

export type CommercialActionPlan = {
  priority: string;
  responseWindow: string;
  suggestedApproach: string;
  likelyObjection: string;
  nextAction: string;
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

export function formatPhoneInput(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function sanitizeLeadText(value: string, maxLength = 80) {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeLeadInput(value: string, maxLength = 80) {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[<>]/g, " ")
    .replace(/\s{2,}/g, " ")
    .slice(0, maxLength);
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

export function getCommercialActionPlan(
  lead: Pick<
    SolarCalculatorLead,
    "monthlyBill" | "propertyOwnership" | "purchaseTimeline" | "propertyType"
  >,
): CommercialActionPlan {
  const temperature = getLeadTemperature(lead);
  const isHighBill = lead.monthlyBill >= 800;
  const ownsProperty = lead.propertyOwnership === "Sim";
  const isUrgent =
    lead.purchaseTimeline === "O quanto antes" || lead.purchaseTimeline === "Nos próximos 30 dias";

  if (temperature.label === "Lead quente") {
    return {
      priority: "Alta",
      responseWindow: "Responder em até 5 minutos",
      suggestedApproach: isHighBill
        ? "Abrir pela economia mensal e já oferecer proposta com financiamento."
        : "Confirmar consumo e mostrar o ganho acumulado no ano.",
      likelyObjection: ownsProperty
        ? "Valor inicial do investimento."
        : "Autorização do proprietário ou responsável pelo imóvel.",
      nextAction: isUrgent
        ? "Enviar proposta preliminar e sugerir visita técnica nesta semana."
        : "Enviar simulação detalhada e combinar o melhor prazo de decisão.",
    };
  }

  if (temperature.label === "Lead em avaliação") {
    return {
      priority: "Média",
      responseWindow: "Responder no mesmo turno comercial",
      suggestedApproach: "Fazer abordagem consultiva, validando conta, telhado e motivação.",
      likelyObjection: ownsProperty ? "Comparação com outras propostas." : "Decisor final ainda não envolvido.",
      nextAction: `Enviar uma simulação para ${lead.propertyType.toLowerCase()} e pedir a conta de energia completa.`,
    };
  }

  return {
    priority: "Nutrição",
    responseWindow: "Responder em até 24 horas",
    suggestedApproach: "Educar com economia anual, valorização do imóvel e exemplos reais.",
    likelyObjection: "Ainda está pesquisando e pode não ter urgência.",
    nextAction: "Enviar conteúdo curto, manter conversa aberta e agendar retomada.",
  };
}

function leadLocation(lead: Pick<SolarCalculatorLead, "city" | "state">) {
  return `${sanitizeLeadText(lead.city, 60)}/${lead.state}`;
}

function firstName(name: string) {
  return sanitizeLeadText(name, 60).split(" ")[0] || "tudo bem";
}

export function buildClientSolarWhatsAppMessage(lead: SolarCalculatorLead) {
  const estimate = calculateSolarSavings(lead.monthlyBill);
  const name = firstName(lead.name);

  return [
    `Olá, ${name}! Sua simulação de energia solar ficou pronta.`,
    "",
    `Conta atual: ${formatCurrency(estimate.monthlyBill)}/mês`,
    `Economia estimada: ${formatCurrency(estimate.monthlySavings)}/mês`,
    `Economia anual: ${formatCurrency(estimate.yearlySavings)}`,
    `Sistema sugerido: ${estimate.estimatedSystemKwp} kWp`,
    `Payback estimado: ${estimate.paybackYears} anos`,
    `Local: ${leadLocation(lead)}`,
    "",
    "Esse é um cálculo comercial inicial. Podemos validar telhado, consumo e proposta final com uma análise técnica rápida.",
  ].join("\n");
}

export function buildSellerSolarWhatsAppMessage(lead: SolarCalculatorLead) {
  const estimate = calculateSolarSavings(lead.monthlyBill);
  const temperature = getLeadTemperature(lead);
  const actionPlan = getCommercialActionPlan(lead);
  const safeName = sanitizeLeadText(lead.name, 60);
  const safePhone = formatPhoneInput(lead.phone);

  return [
    "Novo lead SolarCalc para orçamento solar.",
    "",
    `Nome: ${safeName}`,
    `WhatsApp: ${safePhone}`,
    `Local: ${leadLocation(lead)}`,
    `Conta de luz: ${formatCurrency(estimate.monthlyBill)}/mês`,
    `Economia estimada: ${formatCurrency(estimate.monthlySavings)}/mês (${formatCurrency(
      estimate.yearlySavings,
    )}/ano)`,
    `Sistema estimado: ${estimate.estimatedSystemKwp} kWp`,
    `Investimento estimado: ${formatCurrency(estimate.estimatedInvestment)}`,
    `Payback estimado: ${estimate.paybackYears} anos`,
    `Tipo de imóvel: ${lead.propertyType}`,
    `Imóvel próprio: ${lead.propertyOwnership}`,
    `Prazo de instalação: ${lead.purchaseTimeline}`,
    `Qualificação: ${temperature.label}`,
    `Análise: ${temperature.description}`,
    `Prioridade: ${actionPlan.priority}`,
    `Tempo de resposta sugerido: ${actionPlan.responseWindow}`,
    `Abordagem sugerida: ${actionPlan.suggestedApproach}`,
    `Objeção provável: ${actionPlan.likelyObjection}`,
    `Próxima ação: ${actionPlan.nextAction}`,
  ].join("\n");
}

export function buildSolarLeadWhatsAppHref(companyPhone: string, lead: SolarCalculatorLead) {
  const phone = normalizePhone(companyPhone);
  const message = buildSellerSolarWhatsAppMessage(lead);

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
