import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSolarLeadWhatsAppHref,
  calculateSolarSavings,
  normalizePhone,
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

test("builds a WhatsApp URL with the calculator lead summary", () => {
  const lead: SolarCalculatorLead = {
    monthlyBill: 800,
    city: "Campinas",
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
  assert.match(text, /Campinas/);
  assert.match(text, /R\$ 736\/mês/);
  assert.match(text, /5\.2 kWp/);
});
