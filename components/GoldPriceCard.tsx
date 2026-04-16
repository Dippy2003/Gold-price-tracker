import type { GoldPriceItem } from "@/types/gold";

type GoldPriceCardProps = {
  item: GoldPriceItem;
};

export function GoldPriceCard({ item }: GoldPriceCardProps) {
  return (
    <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-amber-700/40 dark:bg-slate-900/70">
      <h3 className="text-lg font-semibold text-amber-950 dark:text-amber-100 md:text-xl">
        {item.carat}
      </h3>
      <div className="mt-4 space-y-3 text-sm text-amber-950 dark:text-amber-100">
        <div className="rounded-xl bg-amber-50 px-3 py-2 dark:bg-slate-800/80">
          <p className="text-xs text-amber-700 dark:text-amber-200/75">1 Gram</p>
          <p className="text-base font-semibold">LKR {item.gram.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-amber-50 px-3 py-2 dark:bg-slate-800/80">
          <p className="text-xs text-amber-700 dark:text-amber-200/75">1 Pawn (8g)</p>
          <p className="text-base font-semibold">LKR {item.pawn.toLocaleString()}</p>
        </div>
      </div>
    </article>
  );
}
