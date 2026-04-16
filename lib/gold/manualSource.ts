import manualGoldPrice from "@/lib/gold/manualGoldPrice.json";
import type { GoldPriceResponse } from "@/types/gold";

type ManualSourceData = {
  source: string;
  sourceUrl: string;
  effectiveDate: string;
  prices: GoldPriceResponse["prices"];
};

export function getManualGoldPrice(failureReason?: string): GoldPriceResponse {
  const data = manualGoldPrice as ManualSourceData;

  return {
    source: data.source,
    sourceUrl: data.sourceUrl,
    effectiveDate: data.effectiveDate,
    fetchedAt: new Date().toISOString(),
    status: "fallback",
    note: failureReason
      ? `Fallback/manual data is used because live parsing failed: ${failureReason}`
      : "Fallback/manual data is being used.",
    prices: data.prices,
  };
}
