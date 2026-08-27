import type { GoldPriceItem } from "@/types/gold";

type Trend = "up" | "down" | "flat";

type GoldPriceCardProps = {
  item: GoldPriceItem;
  trend?: Trend;
  justUpdated?: boolean;
};

export function GoldPriceCard({ item, trend = "flat", justUpdated = false }: GoldPriceCardProps) {
  const trendLabel = trend === "up" ? "▲ Up" : trend === "down" ? "▼ Down" : "— Steady";

  return (
    <article className={`price-card${justUpdated ? " is-updated" : ""}`}>
      <div className="price-card__top">
        <span className="price-card__carat">{item.carat}</span>
        <span className={`price-card__trend ${trend}`}>{trendLabel}</span>
      </div>
      <div className="price-card__row">
        <span className="price-card__label">1 Gram</span>
        <span className="price-card__value">LKR {item.gram.toLocaleString()}</span>
      </div>
      <div className="price-card__row">
        <span className="price-card__label">1 Pawn (8g)</span>
        <span className="price-card__value">LKR {item.pawn.toLocaleString()}</span>
      </div>
    </article>
  );
}
