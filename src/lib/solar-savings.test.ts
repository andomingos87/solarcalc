import assert from "node:assert/strict";
import test from "node:test";

import {
  buildClientSolarWhatsAppMessage,
  buildSolarLeadWhatsAppHref,
  buildSellerSolarWhatsAppMessage,
  calculateSolarSavings,
  formatPhoneInput,
  getCommercialActionPlan,
  normalizePhone,
  sanitizeLeadInput,
  sanitizeLeadText,
  type SolarCalculatorLead,
} from "./solar-savings.ts";

test("calculates a commercial solar savings estimate from the monthly bill", () => {
  const result = calculateSolarSavings(800);

  assert.equal(result.monthlyBill, 800);
  assert.equal(result.monthlySavings, 736);
  assert.equal(result.yearlySavings, 8832);
  assert.equal(result.annualEconomyPercent, 92);
  assert.equal(result.estimatedSystemKwp, 5.2);
  assert.equal(result.paybackYears, 3);
});

test("normalizes Brazilian WhatsApp numbers without formatting characters", () => {
  assert.equal(normalizePhone("(11) 94520-7618"), "5511945207618");
  assert.equal(normalizePhone("+55 11 94520-7618"), "5511945207618");
});

test("formats phone input and strips unsafe lead text", () => {
  assert.equal(formatPhoneInput("11945207618"), "(11) 94520-7618");
  assert.equal(formatPhoneInput("1133334444"), "(11) 3333-4444");
  assert.equal(sanitizeLeadText("  Marina\u0000 <script> Costa  ", 20), "Marina script Costa");
  assert.equal(sanitizeLeadInput("Marina ", 20), "Marina ");
  assert.equal(sanitizeLeadInput("Marina  <Costa>", 20), "Marina Costa ");
});

test("builds a WhatsApp URL with the calculator lead summary", () => {
  const lead: SolarCalculatorLead = {
    monthlyBill: 800,
    city: "Campinas",
    state: "SP",
    cityId: 3509502,
    propertyType: "Casa",
    propertyOwnership: "Sim",
    purchaseTimeline: "Nos próximos 30 dias",
    name: "Marina Costa",
    phone: "(19) 99999-0000",
  };

  const href = buildSolarLeadWhatsAppHref("5511945207618", lead);
  const url = new URL(href);
  const text = url.searchParams.get("text") ?? "";

  assert.equal(url.origin + url.pathname, "https://wa.me/5511945207618");
  assert.match(text, /Marina Costa/);
  assert.match(text, /Campinas\/SP/);
  assert.match(text, /R\$ 736\/mês/);
  assert.match(text, /5\.2 kWp/);
});

test("builds separate client and seller message templates", () => {
  const lead: SolarCalculatorLead = {
    monthlyBill: 1200,
    city: "Curitiba",
    state: "PR",
    cityId: 4106902,
    propertyType: "Comércio",
    propertyOwnership: "Sim",
    purchaseTimeline: "O quanto antes",
    name: "João Pereira",
    phone: "(41) 99999-0000",
  };

  const clientMessage = buildClientSolarWhatsAppMessage(lead);
  const sellerMessage = buildSellerSolarWhatsAppMessage(lead);

  assert.match(clientMessage, /Olá, João/);
  assert.match(clientMessage, /R\$ 1\.104\/mês/);
  assert.match(sellerMessage, /Novo lead SolarCalc/);
  assert.match(sellerMessage, /Curitiba\/PR/);
  assert.match(sellerMessage, /Lead quente/);
  assert.match(sellerMessage, /Prioridade: Alta/);
  assert.match(sellerMessage, /Responder em até 5 minutos/);
  assert.match(sellerMessage, /Próxima ação:/);
});

test("builds commercial action plans for sales prioritization", () => {
  const hotPlan = getCommercialActionPlan({
    monthlyBill: 1200,
    propertyOwnership: "Sim",
    purchaseTimeline: "O quanto antes",
    propertyType: "Comércio",
  });

  const nurturePlan = getCommercialActionPlan({
    monthlyBill: 300,
    propertyOwnership: "Não",
    purchaseTimeline: "Só estou pesquisando",
    propertyType: "Casa",
  });

  assert.equal(hotPlan.priority, "Alta");
  assert.equal(hotPlan.responseWindow, "Responder em até 5 minutos");
  assert.match(hotPlan.nextAction, /visita técnica/);
  assert.equal(nurturePlan.priority, "Nutrição");
  assert.match(nurturePlan.suggestedApproach, /Educar/);
});
