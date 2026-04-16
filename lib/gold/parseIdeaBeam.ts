import type { GoldPriceItem, SupportedCarat } from "@/types/gold";

const IDEABEAM_URL = "https://ideabeam.com/finance/gold-price-in-sri-lanka/";

export type IdeaBeamParseResult = {
  sourceUrl: string;
  effectiveDate: string;
  prices: GoldPriceItem[];
  note?: string;
};

function toNumber(value: string): number {
  return Number(value.replace(/,/g, "").trim());
}

function parsePrice(html: string, carat: SupportedCarat, unitLabel: string): number | null {
  const caratNumber = carat.replace("K", "");
  const pattern = new RegExp(
    `${caratNumber}\\s*Carat[\\s\\S]{0,180}?${unitLabel.replace(/[()]/g, "\\$&")}[\\s\\S]{0,180}?(?:Rs\\.?|LKR)?\\s*([0-9][0-9,\\.]*)`,
    "i",
  );

  const match = html.match(pattern);
  if (!match?.[1]) {
    return null;
  }

  return toNumber(match[1]);
}

function parseEffectiveDate(html: string): string {
  // Convert HTML to a simple text blob for easier date matching.
  const textContent = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  const datePattern =
    /(last updated|updated on|effective date|date)\s*[:\-]?\s*([A-Za-z]{3,9}\s+\d{1,2},\s+\d{4}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i;
  const match = textContent.match(datePattern);

  if (!match?.[2]) {
    return new Date().toISOString();
  }

  const parsed = new Date(match[2]);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export async function parseIdeaBeam(): Promise<IdeaBeamParseResult> {
  const response = await fetch(IDEABEAM_URL, {
    // Keep results cached and refresh every 30 minutes.
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    throw new Error(`IdeaBeam request failed with status ${response.status}`);
  }

  const html = await response.text();
  if (!html) {
    throw new Error("IdeaBeam page returned empty HTML");
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
    throw new Error("Could not parse all required IdeaBeam gold price values");
  }

  return {
    sourceUrl: IDEABEAM_URL,
    effectiveDate: parseEffectiveDate(html),
    prices,
    note: "Parsed from IdeaBeam HTML using regex and string matching.",
  };
}
