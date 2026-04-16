import { getManualGoldPrice } from "@/lib/gold/manualSource";
import { parseRaviJewellers } from "@/lib/gold/parseRaviJewellers";
import type { GoldPriceResponse } from "@/types/gold";

const RAVI_URL = "https://ravijewellers.lk/";

export async function getGoldPrice(): Promise<GoldPriceResponse> {
  try {
    const parsed = await parseRaviJewellers();
    return {
      source: "Ravi Jewellers",
      sourceUrl: parsed.sourceUrl,
      effectiveDate: parsed.effectiveDate,
      fetchedAt: new Date().toISOString(),
      status: "ok",
      note: parsed.note,
      prices: parsed.prices,
    };
  } catch (raviError) {
    const raviMessage =
      raviError instanceof Error ? raviError.message : "Unknown Ravi parser error";

    // Ravi-only live source; fallback to local manual data if unavailable.
    try {
      return getManualGoldPrice(`RaviJewellers: ${raviMessage}.`);
    } catch (manualError) {
      const manualMessage =
        manualError instanceof Error ? manualError.message : "Unknown manual source error";

      return {
        source: "Ravi Jewellers",
        sourceUrl: RAVI_URL,
        effectiveDate: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        status: "error",
        note: `Ravi failed (${raviMessage}) and manual fallback failed (${manualMessage}).`,
        prices: [],
      };
    }
  }
}
