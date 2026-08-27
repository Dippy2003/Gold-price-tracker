"use client";

import { useEffect, useRef, useState } from "react";
import { PriceGrid } from "@/components/PriceGrid";
import { ProductPriceCalculator } from "@/components/ProductPriceCalculator";
import { SourceInfo } from "@/components/SourceInfo";
import type { GoldPriceItem, GoldPriceResponse, SupportedCarat } from "@/types/gold";

const POLL_INTERVAL_MS = 30_000;

type Trend = "up" | "down" | "flat";

function computeTrends(
  next: GoldPriceItem[],
  previous: GoldPriceItem[] | null,
): Partial<Record<SupportedCarat, Trend>> {
  if (!previous) return {};

  const trends: Partial<Record<SupportedCarat, Trend>> = {};
  for (const item of next) {
    const prevItem = previous.find((p) => p.carat === item.carat);
    if (!prevItem) continue;
    if (item.gram > prevItem.gram) trends[item.carat] = "up";
    else if (item.gram < prevItem.gram) trends[item.carat] = "down";
    else trends[item.carat] = "flat";
  }
  return trends;
}

function secondsAgoLabel(fromIso: string, nowMs: number): string {
  const seconds = Math.max(0, Math.round((nowMs - new Date(fromIso).getTime()) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  return `${minutes}m ago`;
}

type LivePriceBoardProps = {
  initialData: GoldPriceResponse;
};

export function LivePriceBoard({ initialData }: LivePriceBoardProps) {
  const [data, setData] = useState<GoldPriceResponse>(initialData);
  const [trends, setTrends] = useState<Partial<Record<SupportedCarat, Trend>>>({});
  const [justUpdated, setJustUpdated] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string>(initialData.fetchedAt);
  const [nowTick, setNowTick] = useState<number>(Date.now());
  const previousPricesRef = useRef<GoldPriceItem[] | null>(initialData.prices);

  useEffect(() => {
    const clockId = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(clockId);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch("/api/gold-price", { cache: "no-store" });
        if (!response.ok) return;
        const fresh = (await response.json()) as GoldPriceResponse;
        if (cancelled) return;

        setData((current) => {
          const changed = JSON.stringify(current.prices) !== JSON.stringify(fresh.prices);
          if (changed) {
            setTrends(computeTrends(fresh.prices, previousPricesRef.current));
            previousPricesRef.current = fresh.prices;
            setJustUpdated(true);
            setTimeout(() => setJustUpdated(false), 1200);
          }
          return fresh;
        });
        setCheckedAt(new Date().toISOString());
      } catch {
        // Silently keep showing the last known-good data; next tick retries.
      }
    }

    const intervalId = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const badgeClass =
    data.status === "ok" ? "live-badge" : data.status === "fallback" ? "live-badge is-fallback" : "live-badge is-error";
  const badgeText =
    data.status === "ok" ? "Live" : data.status === "fallback" ? "Fallback data" : "Data unavailable";

  return (
    <>
      <div className={badgeClass}>
        <span className="live-dot" />
        <span>
          {badgeText} · Checked <strong>{secondsAgoLabel(checkedAt, nowTick)}</strong>
        </span>
      </div>

      {data.status === "error" || data.prices.length === 0 ? (
        <section className="jewelry-error">
          We could not refresh live prices right now. Please try again in a few minutes.
        </section>
      ) : (
        <>
          <PriceGrid prices={data.prices} trends={trends} justUpdated={justUpdated} />
          <ProductPriceCalculator prices={data.prices} />
          <SourceInfo
            source={data.source}
            sourceUrl={data.sourceUrl}
            effectiveDate={data.effectiveDate}
            fetchedAt={data.fetchedAt}
            status={data.status}
            note={data.note}
          />
        </>
      )}
    </>
  );
}
