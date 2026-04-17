import { GoldPriceCard } from "@/components/GoldPriceCard";
import type { GoldPriceItem } from "@/types/gold";

type PriceGridProps = {
  prices: GoldPriceItem[];
};

export function PriceGrid({ prices }: PriceGridProps) {
  return (
    <section className="price-section">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {prices.map((item) => (
          <GoldPriceCard key={item.carat} item={item} />
        ))}
      </div>
    </section>
  );
}
