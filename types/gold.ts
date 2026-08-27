export type SupportedCarat = "24K" | "22K" | "21K";

export type GoldPriceItem = {
  carat: SupportedCarat;
  gram: number;
  pawn: number;
};

export type GoldPriceResponse = {
  source: string;
  sourceUrl: string;
  effectiveDate: string;
  fetchedAt: string;
  status: "ok" | "fallback" | "error";
  note?: string;
  prices: GoldPriceItem[];
};
