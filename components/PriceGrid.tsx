import { GoldPriceCard } from "@/components/GoldPriceCard";
import type { GoldPriceItem } from "@/types/gold";

type PriceGridProps = {
  prices: GoldPriceItem[];
};

export function PriceGrid({ prices }: PriceGridProps) {
  return (
    <section className="price-section">
      <div className="price-grid-container">
        {prices.map((item) => (
          <GoldPriceCard key={item.carat} item={item} />
        ))}
      </div>
    </section>
  );
}
