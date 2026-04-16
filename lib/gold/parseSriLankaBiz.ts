import type { GoldPriceItem, SupportedCarat } from "@/types/gold";

const SRILANKABIZ_URL =
  "https://srilankabiz.lk/sri-lanka-gold-price-apr-16-2026/?utm_source=chatgpt.com";

export type SriLankaBizParseResult = {
  sourceUrl: string;
  effectiveDate: string;
  prices: GoldPriceItem[];
  note?: string;
};

function toNumber(raw: string): number {
  return Number(raw.replace(/[^0-9.]/g, ""));
}

function parsePrice(html: string, carat: SupportedCarat, unitLabel: string): number | null {
  const caratNumber = carat.replace("K", "");
  const pattern = new RegExp(
    `${caratNumber}\\s*Carat\\s*${unitLabel.replace(/[()]/g, "\\$&")}[\\s\\S]{0,120}?Rs\\.?\\s*([0-9][0-9,\\.]*)`,
    "i",
  );

  const match = html.match(pattern);
  if (!match?.[1]) {
    return null;
  }

  const value = toNumber(match[1]);
  return value > 0 ? value : null;
}

function parseEffectiveDate(html: string): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const match = text.match(/([A-Za-z]{3,9}\s+\d{1,2},\s+\d{4})/i);

  if (!match?.[1]) {
    return new Date().toISOString();
  }

  const parsedDate = new Date(match[1]);
  return Number.isNaN(parsedDate.getTime())
    ? new Date().toISOString()
    : parsedDate.toISOString();
}

export async function parseSriLankaBiz(): Promise<SriLankaBizParseResult> {
  const response = await fetch(SRILANKABIZ_URL, {
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    throw new Error(`SriLankaBiz request failed with status ${response.status}`);
  }

  const html = await response.text();
  if (!html) {
    throw new Error("SriLankaBiz page returned empty HTML");
  }

  const prices: GoldPriceItem[] = [
    {
      carat: "24K",
      gram: parsePrice(html, "24K", "1 Gram") ?? 0,
      pawn: parsePrice(html, "24K", "8 Grams (1 Pawn)") ?? 0,
    },
    {
      carat: "22K",
      gram: parsePrice(html, "22K", "1 Gram") ?? 0,
      pawn: parsePrice(html, "22K", "8 Grams (1 Pawn)") ?? 0,
    },
    {
      carat: "21K",
      gram: parsePrice(html, "21K", "1 Gram") ?? 0,
      pawn: parsePrice(html, "21K", "8 Grams (1 Pawn)") ?? 0,
    },
  ];

  const hasMissingValues = prices.some((item) => item.gram <= 0 || item.pawn <= 0);
  if (hasMissingValues) {
    throw new Error("Could not parse all required SriLankaBiz gold price values");
  }

  return {
    sourceUrl: SRILANKABIZ_URL,
    effectiveDate: parseEffectiveDate(html),
    prices,
    note: "Parsed from SriLankaBiz HTML table data.",
  };
}
