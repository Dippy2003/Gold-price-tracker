"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import logo from "@/logo.svg";
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
  const [milligrams, setMilligrams] = useState<number>(0);
  const [makingCost, setMakingCost] = useState<number>(0);
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);

  const selectedRatePerGram = useMemo(() => {
    return prices.find((item) => item.carat === carat)?.gram ?? 0;
  }, [prices, carat]);

  const extraTotal = useMemo(() => {
    return extraCharges.reduce((sum, charge) => sum + (charge.amount || 0), 0);
  }, [extraCharges]);

  const totalGrams = (grams || 0) + (milligrams || 0) / 1000;
  const goldValue = selectedRatePerGram * totalGrams;
  const total = goldValue + (makingCost || 0) + extraTotal;

  function parseNumberInput(value: string): number {
    const cleaned = value.replace(/,/g, "").trim();
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  function formatLkr(value: number) {
    return `LKR ${value.toLocaleString()}`;
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

  async function svgToPngDataUrl(svgUrl: string, size = 360): Promise<string> {
    const response = await fetch(svgUrl);
    if (!response.ok) throw new Error("Failed to load logo for PDF.");
    const svgText = await response.text();
    const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const svgBlobUrl = URL.createObjectURL(svgBlob);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Unable to render logo for PDF."));
        img.src = svgBlobUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas context not available.");
      context.clearRect(0, 0, size, size);
      context.drawImage(image, 0, 0, size, size);
      return canvas.toDataURL("image/png");
    } finally {
      URL.revokeObjectURL(svgBlobUrl);
    }
  }

  async function downloadCustomerPdf() {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = pdf.internal.pageSize.getWidth();   // 210
    const H = pdf.internal.pageSize.getHeight();  // 297
    const margin = 14;
    const inner = W - margin * 2;
    const dateText = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    const timeText = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    // ── 1. Deep charcoal background ──────────────────────────
    pdf.setFillColor(10, 9, 7);
    pdf.rect(0, 0, W, H, "F");

    // ── 2. Outer gold border frame ───────────────────────────
    pdf.setDrawColor(201, 168, 76);
    pdf.setLineWidth(0.6);
    pdf.roundedRect(6, 6, W - 12, H - 12, 4, 4, "S");

    // Inner thin border
    pdf.setLineWidth(0.2);
    pdf.setDrawColor(201, 168, 76);
    pdf.roundedRect(8.5, 8.5, W - 17, H - 17, 3, 3, "S");

    // ── 3. Header band ───────────────────────────────────────
    pdf.setFillColor(18, 15, 9);
    pdf.rect(8.5, 8.5, W - 17, 42, "F");

    // Gold top accent line
    pdf.setFillColor(201, 168, 76);
    pdf.rect(8.5, 8.5, W - 17, 1.2, "F");

    // ── 4. Logo ──────────────────────────────────────────────
    try {
      const logoPng = await svgToPngDataUrl(logo.src);
      pdf.addImage(logoPng, "PNG", margin + 2, 16, 18, 18);
    } catch { /* skip */ }

    // Brand name
    pdf.setTextColor(232, 223, 200);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(17);
    pdf.text("WIJESINGHE", margin + 24, 23);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(17);
    pdf.text("JEWELERS", margin + 24, 31);

    // Tagline
    pdf.setTextColor(122, 106, 74);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.text("EST. SRI LANKA  ·  LIVE GOLD PRICES", margin + 24, 37.5);

    // Right side — document title
    pdf.setTextColor(201, 168, 76);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text("GOLD PRICE ESTIMATE", W - margin, 20, { align: "right" });
    pdf.setTextColor(90, 78, 56);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.text(dateText, W - margin, 27, { align: "right" });
    pdf.text(timeText, W - margin, 34, { align: "right" });

    // Header bottom divider
    pdf.setDrawColor(50, 43, 28);
    pdf.setLineWidth(0.3);
    pdf.line(margin, 50.5, W - margin, 50.5);
    // Gold diamond center
    pdf.setFillColor(201, 168, 76);
    pdf.rect(W / 2 - 1.5, 49.3, 3, 3, "F"); // diamond approx

    // ── 5. "Quote for" section ───────────────────────────────
    pdf.setFillColor(18, 15, 9);
    pdf.roundedRect(margin, 55, inner, 12, 2, 2, "F");
    pdf.setDrawColor(40, 35, 20);
    pdf.setLineWidth(0.2);
    pdf.roundedRect(margin, 55, inner, 12, 2, 2, "S");

    pdf.setTextColor(90, 78, 56);
    pdf.setFontSize(7);
    pdf.text("PREPARED FOR", margin + 4, 60.5);
    pdf.setTextColor(201, 168, 76);
    pdf.setFontSize(8.5);
    pdf.text("Customer", margin + 4, 64.5);

    pdf.setTextColor(90, 78, 56);
    pdf.setFontSize(7);
    pdf.text("REFERENCE NO.", W - margin - 4, 60.5, { align: "right" });
    const refNo = `WJ-${Date.now().toString().slice(-6)}`;
    pdf.setTextColor(201, 168, 76);
    pdf.setFontSize(8.5);
    pdf.text(refNo, W - margin - 4, 64.5, { align: "right" });

    // ── 6. Details table header ──────────────────────────────
    let y = 72;
    pdf.setFillColor(25, 21, 12);
    pdf.roundedRect(margin, y, inner, 8, 1.5, 1.5, "F");
    // left gold accent stripe
    pdf.setFillColor(201, 168, 76);
    pdf.roundedRect(margin, y, 2.5, 8, 1, 1, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(201, 168, 76);
    pdf.text("DESCRIPTION", margin + 6, y + 5.2);
    pdf.text("AMOUNT", W - margin - 4, y + 5.2, { align: "right" });

    y += 10;

    // ── 7. Table rows (customer-facing — no making cost or extra charges shown)
    // Making cost + extra charges are included in the total but hidden from the customer.
    const rows: [string, string][] = [
      ["Gold Type / Carat",        carat],
      ["Gold Weight",              `${totalGrams.toFixed(3)} g`],
      [`Rate per Gram (${carat})`, formatLkr(selectedRatePerGram)],
      ["Gold Value",               formatLkr(goldValue)],
    ];

    for (let i = 0; i < rows.length; i++) {
      const [label, val] = rows[i];
      const rowH = 9;
      // alternating row bg
      pdf.setFillColor(i % 2 === 0 ? 14 : 18, i % 2 === 0 ? 12 : 15, i % 2 === 0 ? 7 : 9);
      pdf.rect(margin, y, inner, rowH, "F");

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(168, 152, 120);
      pdf.text(label, margin + 5, y + 6);

      pdf.setTextColor(220, 210, 185);
      pdf.text(val, W - margin - 5, y + 6, { align: "right" });

      // subtle row separator
      pdf.setDrawColor(30, 26, 15);
      pdf.setLineWidth(0.15);
      pdf.line(margin, y + rowH, W - margin, y + rowH);

      y += rowH;
    }

    // ── 8. Total box ─────────────────────────────────────────
    y += 4;

    // Gold gradient simulation: two layered rects
    pdf.setFillColor(180, 140, 50);
    pdf.roundedRect(margin, y, inner, 22, 3, 3, "F");
    pdf.setFillColor(212, 168, 64);
    pdf.roundedRect(margin, y, inner, 11, 3, 3, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(40, 30, 10);
    pdf.text("TOTAL PRODUCT PRICE", margin + 6, y + 6.5);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(30, 22, 5);
    pdf.text("Inclusive of all charges", margin + 6, y + 17.5);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(15, 10, 3);
    pdf.text(formatLkr(total), W - margin - 6, y + 17, { align: "right" });

    // ── 9. Notes section ─────────────────────────────────────
    y += 30;
    pdf.setFillColor(16, 14, 8);
    pdf.roundedRect(margin, y, inner, 22, 2, 2, "F");
    pdf.setDrawColor(35, 30, 18);
    pdf.setLineWidth(0.2);
    pdf.roundedRect(margin, y, inner, 22, 2, 2, "S");

    pdf.setTextColor(90, 78, 56);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.text("IMPORTANT NOTES", margin + 5, y + 5.5);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(80, 68, 46);
    const notes = [
      "· Prices are based on today's live market rates and are subject to change.",
      "· This estimate is valid for today only. Final price confirmed at point of sale.",
      "· Making charges, stone costs, and taxes may vary by item.",
    ];
    notes.forEach((note, i) => {
      pdf.text(note, margin + 5, y + 10 + i * 4.5);
    });

    // ── 10. Footer ───────────────────────────────────────────
    const footY = H - 18;
    pdf.setDrawColor(35, 30, 18);
    pdf.setLineWidth(0.25);
    pdf.line(margin, footY, W - margin, footY);

    pdf.setTextColor(60, 50, 30);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.text("Thank you for choosing Wijesinghe Jewelers — Est. Sri Lanka", margin, footY + 5);

    pdf.setTextColor(201, 168, 76);
    pdf.setFontSize(7);
    pdf.text("wijesinghe.lk", W - margin, footY + 5, { align: "right" });

    // bottom gold line
    pdf.setFillColor(201, 168, 76);
    pdf.rect(8.5, H - 9.5, W - 17, 0.8, "F");

    const fileDate = new Date().toISOString().slice(0, 10);
    pdf.save(`wijesinghe-gold-quote-${fileDate}.pdf`);
  }

  return (
    <section className="calc-section">
      <div className="calc-wrapper">
        <p className="calc-title">Price Calculator</p>
        <h2 className="calc-heading">Product Price Estimator</h2>
        <p className="calc-sub">Enter weight, making cost and extra charges to estimate the final price.</p>

        {/* ── Main fields ── */}
        <div className="calc-fields-grid">
          <div className="calc-field">
            <label htmlFor="calc-carat">Carat</label>
            <select
              id="calc-carat"
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
            <label htmlFor="calc-grams">Gold Weight (g)</label>
            <input
              id="calc-grams"
              type="text"
              inputMode="decimal"
              value={grams}
              onChange={(event) => setGrams(parseNumberInput(event.target.value))}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label htmlFor="calc-milligrams">Gold Weight (mg)</label>
            <input
              id="calc-milligrams"
              type="text"
              inputMode="decimal"
              value={milligrams}
              onChange={(event) => setMilligrams(parseNumberInput(event.target.value))}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label htmlFor="calc-making">Making / Build Cost (LKR)</label>
            <input
              id="calc-making"
              type="text"
              inputMode="decimal"
              value={makingCost}
              onChange={(event) => setMakingCost(parseNumberInput(event.target.value))}
              className="calc-input"
            />
          </div>
        </div>

        {/* ── Extra charges ── */}
        <div className="extra-charges-header">
          <span className="extra-charges-label">Additional Charges</span>
          <button type="button" onClick={addExtraCharge} className="btn-add-charge">
            + Add Charge
          </button>
        </div>

        <div>
          {extraCharges.length === 0 ? (
            <p className="no-charges-msg">No additional charges added.</p>
          ) : null}

          {extraCharges.map((charge) => (
            <div key={charge.id} className="charge-row">
              <input
                type="text"
                value={charge.label}
                onChange={(event) => updateCharge(charge.id, "label", event.target.value)}
                placeholder="Charge name (e.g. Stone cost)"
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
              <button
                type="button"
                onClick={() => removeCharge(charge.id)}
                className="btn-remove"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* ── Result panel ── */}
        <div className="calc-result-panel">
          <div className="calc-breakdown">
            <div>Gold Value: {selectedRatePerGram.toLocaleString()} × {totalGrams.toFixed(3)}g = <span>LKR {goldValue.toLocaleString()}</span></div>
            <div>Making Cost: <span>LKR {(makingCost || 0).toLocaleString()}</span></div>
            <div>Extra Charges: <span>LKR {extraTotal.toLocaleString()}</span></div>
          </div>

          <p className="calc-total-label">Total Product Price</p>
          <p className="calc-total-value">LKR {total.toLocaleString()}</p>

          <button type="button" onClick={downloadCustomerPdf} className="btn-download">
            ↓ Download Customer PDF
          </button>
        </div>
      </div>
    </section>
  );
}