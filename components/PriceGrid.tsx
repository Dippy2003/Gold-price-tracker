import { GoldPriceCard } from "@/components/GoldPriceCard";
import type { GoldPriceItem } from "@/types/gold";

type Trend = "up" | "down" | "flat";

type PriceGridProps = {
  prices: GoldPriceItem[];
  trends?: Partial<Record<GoldPriceItem["carat"], Trend>>;
  justUpdated?: boolean;
};

export function PriceGrid({ prices, trends = {}, justUpdated = false }: PriceGridProps) {
  return (
    <section className="price-grid">
      {prices.map((item) => (
        <GoldPriceCard
          key={item.carat}
          item={item}
          trend={trends[item.carat] ?? "flat"}
          justUpdated={justUpdated}
        />
      ))}
    </section>
  );
}
