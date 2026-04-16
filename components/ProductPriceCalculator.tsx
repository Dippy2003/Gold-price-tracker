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

  const selectedRatePerGram = useMemo(() => {
    return prices.find((item) => item.carat === carat)?.gram ?? 0;
  }, [prices, carat]);

  const extraTotal = useMemo(() => {
    return extraCharges.reduce((sum, charge) => sum + (charge.amount || 0), 0);
  }, [extraCharges]);

  const goldValue = selectedRatePerGram * (grams || 0);
  const total = goldValue + (makingCost || 0) + extraTotal;

  function parseNumberInput(value: string): number {
    // Allow users to type values freely (including commas).
    const cleaned = value.replace(/,/g, "").trim();
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  function addExtraCharge() {
    setExtraCharges((previous) => [
      ...previous,
      { id: Date.now(), label: `Charge ${previous.length + 1}`, amount: 0 },
    ]);
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
    <section className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-5 text-amber-100 shadow-md backdrop-blur-sm">
      <h2 className="text-lg font-semibold md:text-xl">Product Price Calculator</h2>
      <p className="mt-1 text-sm text-amber-100/70">
        Enter grams, making cost, and any extra charges to estimate final product price.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block text-amber-100/80">Carat</span>
          <select
            value={carat}
            onChange={(event) => setCarat(event.target.value as SupportedCarat)}
            className="w-full rounded-lg border border-amber-400/30 bg-slate-800 px-3 py-2 outline-none focus:border-amber-400"
          >
            <option value="24K">24K</option>
            <option value="22K">22K</option>
            <option value="21K">21K</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-amber-100/80">Gold Weight (grams)</span>
          <input
            type="text"
            inputMode="decimal"
            value={grams}
            onChange={(event) => setGrams(parseNumberInput(event.target.value))}
            className="w-full rounded-lg border border-amber-400/30 bg-slate-800 px-3 py-2 outline-none focus:border-amber-400"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-amber-100/80">Making / Build Cost (LKR)</span>
          <input
            type="text"
            inputMode="decimal"
            value={makingCost}
            onChange={(event) => setMakingCost(parseNumberInput(event.target.value))}
            className="w-full rounded-lg border border-amber-400/30 bg-slate-800 px-3 py-2 outline-none focus:border-amber-400"
          />
        </label>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium">Additional Charges</p>
          <button
            type="button"
            onClick={addExtraCharge}
            className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-medium hover:bg-amber-400/20"
          >
            + Add More Charge
          </button>
        </div>

        <div className="space-y-2">
          {extraCharges.length === 0 ? (
            <p className="text-xs text-amber-100/60">No extra charges added yet.</p>
          ) : null}

          {extraCharges.map((charge) => (
            <div key={charge.id} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_180px_80px]">
              <input
                type="text"
                value={charge.label}
                onChange={(event) => updateCharge(charge.id, "label", event.target.value)}
                placeholder="Charge name (example: Stone cost)"
                className="rounded-lg border border-amber-400/30 bg-slate-800 px-3 py-2 text-sm outline-none focus:border-amber-400"
              />
              <input
                type="text"
                inputMode="decimal"
                value={charge.amount}
                onChange={(event) => updateCharge(charge.id, "amount", event.target.value)}
                placeholder="Amount"
                className="rounded-lg border border-amber-400/30 bg-slate-800 px-3 py-2 text-sm outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => removeCharge(charge.id)}
                className="rounded-lg border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm hover:bg-red-400/20"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-amber-400/30 bg-slate-800/80 p-4 text-sm">
        <p>
          Gold Value: LKR {selectedRatePerGram.toLocaleString()} x {grams || 0}g ={" "}
          <span className="font-semibold">LKR {goldValue.toLocaleString()}</span>
        </p>
        <p className="mt-1">
          Making Cost: <span className="font-semibold">LKR {(makingCost || 0).toLocaleString()}</span>
        </p>
        <p className="mt-1">
          Extra Charges: <span className="font-semibold">LKR {extraTotal.toLocaleString()}</span>
        </p>
        <p className="mt-3 text-lg font-bold text-amber-300">
          Total Product Price: LKR {total.toLocaleString()}
        </p>
      </div>
    </section>
  );
}
