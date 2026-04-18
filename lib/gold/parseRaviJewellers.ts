import type { GoldPriceItem } from "@/types/gold";

const RAVI_JEWELLERS_URL = "https://ravijewellers.lk/";

export type RaviJewellersParseResult = {
  sourceUrl: string;
  effectiveDate: string;
  prices: GoldPriceItem[];
  note?: string;
};

function toNumber(raw: string): number {
  return Number(raw.replace(/[^0-9.]/g, ""));
}

function parseLatestDate(text: string): string {
  const dateRegex = /DATE:\s*(\d{2}\/\d{2}\/\d{4})/gi;
  let latestDate: string | null = null;
  let match: RegExpExecArray | null = null;

  while ((match = dateRegex.exec(text)) !== null) {
    latestDate = match[1];
  }

  if (!latestDate) {
    return new Date().toISOString();
  }

  // Convert DD/MM/YYYY into ISO date.
  const [day, month, year] = latestDate.split("/");
  const parsedDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  return Number.isNaN(parsedDate.getTime())
    ? new Date().toISOString()
    : parsedDate.toISOString();
}

function buildPricesFrom22K(base22KValue: number): GoldPriceItem[] {
  // Ravi page usually gives one 22KT market value.
  // If value is very large, treat it as pawn value; otherwise as gram value.
  const isPawnLikeValue = base22KValue > 100000;
  const pawn22KRaw = isPawnLikeValue ? base22KValue : base22KValue * 8;
  const gram22K = isPawnLikeValue ? base22KValue / 8 : base22KValue;

  // Ravi provides only 22K, so estimate 24K/21K by purity ratio.
  // Round pawn values to common market buckets shown by local jewellers.
  const roundPawn = (value: number) => Math.round(value / 10000) * 10000;
  const roundGram = (value: number) => Number(value.toFixed(2));

  const pawn22K = isPawnLikeValue ? pawn22KRaw : roundPawn(pawn22KRaw);
  const pawn24K = roundPawn(pawn22KRaw * (24 / 22));
  const pawn21K = roundPawn(pawn22KRaw * (21 / 22));
  const pawn18K = roundPawn(pawn22KRaw * (18 / 22));

  return [
    {
      carat: "24K",
      gram: roundGram(pawn24K / 8),
      pawn: pawn24K,
    },
    {
      carat: "22K",
      gram: roundGram(gram22K),
      pawn: pawn22K,
    },
    {
      carat: "21K",
      gram: roundGram(pawn21K / 8),
      pawn: pawn21K,
    },
    {
      carat: "18K",
      gram: roundGram(pawn18K / 8),
      pawn: pawn18K,
    },
  ];
}

export async function parseRaviJewellers(): Promise<RaviJewellersParseResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(RAVI_JEWELLERS_URL, {
      next: { revalidate: 1800 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`Ravi Jewellers request failed with status ${response.status}`);
  }

  const html = await response.text();
    if (!html) {
      throw new Error("Ravi Jewellers page returned empty HTML");
    }

    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const priceRegex = /22KT?\s*LKR\s*([0-9][0-9,\.]*)/gi;
    let latest22K: string | null = null;
    let priceMatch: RegExpExecArray | null = null;

    while ((priceMatch = priceRegex.exec(text)) !== null) {
      latest22K = priceMatch[1];
    }

    if (!latest22K) {
      throw new Error("Could not find 22KT LKR value on Ravi Jewellers page");
    }

    const numeric22K = toNumber(latest22K);
    if (!numeric22K || numeric22K <= 0) {
      throw new Error("Invalid 22KT LKR value on Ravi Jewellers page");
    }

    return {
      sourceUrl: RAVI_JEWELLERS_URL,
      effectiveDate: parseLatestDate(text),
      prices: buildPricesFrom22K(numeric22K),
      note: "Parsed from Ravi Jewellers 22KT value; 24K, 21K, and 18K are estimated by purity ratio.",
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request to Ravi Jewellers timed out after 10 seconds');
    }
    throw error;
  }
}
