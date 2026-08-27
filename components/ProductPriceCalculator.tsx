"use client";

import { useMemo, useState } from "react";
import type { GoldPriceItem, SupportedCarat } from "@/types/gold";

type ExtraCharge = {
  id: number;
  label: string;
  amount: number;
};

type ProductPriceCalculatorProps = {
  prices: GoldPriceItem[];
};

export function ProductPriceCalculator({ prices }: ProductPriceCalculatorProps) {
  const [carat, setCarat] = useState<SupportedCarat>("22K");
  const [grams, setGrams] = useState<number>(1);
  const [makingCost, setMakingCost] = useState<number>(0);
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
  const [chargeSeq, setChargeSeq] = useState(0);

  const selectedRatePerGram = useMemo(() => {
    return prices.find((item) => item.carat === carat)?.gram ?? 0;
  }, [prices, carat]);

  const extraTotal = useMemo(() => {
    return extraCharges.reduce((sum, charge) => sum + (charge.amount || 0), 0);
  }, [extraCharges]);

  const goldValue = selectedRatePerGram * (grams || 0);
  const total = goldValue + (makingCost || 0) + extraTotal;

  function parseNumberInput(value: string): number {
    const cleaned = value.replace(/,/g, "").trim();
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  function addExtraCharge() {
    setExtraCharges((previous) => [
      ...previous,
      { id: chargeSeq, label: `Charge ${previous.length + 1}`, amount: 0 },
    ]);
    setChargeSeq((seq) => seq + 1);
  }

  function updateCharge(id: number, field: "label" | "amount", value: string) {
    setExtraCharges((previous) =>
      previous.map((charge) =>
        charge.id === id
          ? {
              ...charge,
              [field]: field === "amount" ? parseNumberInput(value) : value,
            }
          : charge,
      ),
    );
  }

  function removeCharge(id: number) {
    setExtraCharges((previous) => previous.filter((charge) => charge.id !== id));
  }

  return (
    <section className="calc-wrapper">
      <h2 className="calc-title">Product Price Calculator</h2>
      <p className="calc-subtitle">
        Enter grams, making cost, and any extra charges to estimate the final product price.
      </p>

      <div className="calc-grid">
        <div className="calc-field">
          <label>Carat</label>
          <select
            value={carat}
            onChange={(event) => setCarat(event.target.value as SupportedCarat)}
            className="calc-select"
          >
            <option value="24K">24K</option>
            <option value="22K">22K</option>
            <option value="21K">21K</option>
          </select>
        </div>

        <div className="calc-field">
          <label>Gold Weight (grams)</label>
          <input
            type="text"
            inputMode="decimal"
            value={grams}
            onChange={(event) => setGrams(parseNumberInput(event.target.value))}
            className="calc-input"
          />
        </div>

        <div className="calc-field">
          <label>Making / Build Cost (LKR)</label>
          <input
            type="text"
            inputMode="decimal"
            value={makingCost}
            onChange={(event) => setMakingCost(parseNumberInput(event.target.value))}
            className="calc-input"
          />
        </div>
      </div>

      <div className="charges-head">
        <p>Additional Charges</p>
        <button type="button" onClick={addExtraCharge} className="btn-ghost">
          + Add More Charge
        </button>
      </div>

      {extraCharges.length === 0 ? (
        <p style={{ marginTop: "0.6rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          No extra charges added yet.
        </p>
      ) : null}

      {extraCharges.map((charge) => (
        <div key={charge.id} className="charge-row">
          <input
            type="text"
            value={charge.label}
            onChange={(event) => updateCharge(charge.id, "label", event.target.value)}
            placeholder="Charge name (example: Stone cost)"
            className="calc-input"
          />
          <input
            type="text"
            inputMode="decimal"
            value={charge.amount}
            onChange={(event) => updateCharge(charge.id, "amount", event.target.value)}
            placeholder="Amount"
            className="calc-input"
          />
          <button type="button" onClick={() => removeCharge(charge.id)} className="btn-remove">
            Remove
          </button>
        </div>
      ))}

      <div className="calc-result">
        <p>
          Gold Value: LKR {selectedRatePerGram.toLocaleString()} × {grams || 0}g ={" "}
          <strong style={{ color: "var(--text-primary)" }}>LKR {goldValue.toLocaleString()}</strong>
        </p>
        <p>
          Making Cost: <strong style={{ color: "var(--text-primary)" }}>LKR {(makingCost || 0).toLocaleString()}</strong>
        </p>
        <p>
          Extra Charges: <strong style={{ color: "var(--text-primary)" }}>LKR {extraTotal.toLocaleString()}</strong>
        </p>
        <p className="calc-result__total">Total Product Price: LKR {total.toLocaleString()}</p>
      </div>
    </section>
  );
}
