import type { GoldPriceItem } from "@/types/gold";

type GoldPriceCardProps = {
  item: GoldPriceItem;
};

export function GoldPriceCard({ item }: GoldPriceCardProps) {
  return (
    <article className="gold-price-card">
      <p className="karat-label">Gold Purity</p>
      <h3 className="karat-value">{item.carat}</h3>

      <div className="price-row">
        <p className="price-unit">1 Gram</p>
        <p className="price-amount">LKR {item.gram.toLocaleString()}</p>
      </div>

      <div className="price-row">
        <p className="price-unit">1 Pawn (8g)</p>
        <p className="price-amount">LKR {item.pawn.toLocaleString()}</p>
      </div>
    </article>
  );
}
