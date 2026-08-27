import { LivePriceBoard } from "@/components/LivePriceBoard";
import { MouseGlow } from "@/components/MouseGlow";
import type { GoldPriceResponse } from "@/types/gold";
import { headers } from "next/headers";

async function fetchGoldPrices(): Promise<GoldPriceResponse> {
  const requestHeaders = headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) throw new Error("Could not determine request host");

  const apiUrl = `${protocol}://${host}/api/gold-price`;

  const response = await fetch(
    apiUrl,
    process.env.NODE_ENV === "development"
      ? { cache: "no-store" }
      : { next: { revalidate: 60 } },
  );

  if (!response.ok)
    throw new Error(`API request failed with status ${response.status}`);

  return (await response.json()) as GoldPriceResponse;
}

export default async function Home() {
  let goldPrice: GoldPriceResponse | null = null;
  try {
    goldPrice = await fetchGoldPrices();
  } catch {
    goldPrice = null;
  }

  return (
    <main className="jewelry-page">
      <MouseGlow />
      <div className="jewelry-ambient" aria-hidden="true">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
      </div>

      <div className="jewelry-content">
        <header className="jewelry-header">
          <div className="header-top">
            <div className="brand-block">
              <span className="brand-eyebrow">Wijesinghe Jewelers</span>
              <h1 className="brand-title">Sri Lanka Gold Rates</h1>
              <p className="brand-subtitle">
                Live 24K, 22K, and 21K gold prices, refreshed automatically — no need to reload the page.
              </p>
            </div>
          </div>
        </header>

        {goldPrice ? (
          <LivePriceBoard initialData={goldPrice} />
        ) : (
          <section className="jewelry-error">
            Something went wrong while loading the gold prices. Please refresh the page.
          </section>
        )}

        <footer className="jewelry-footer">
          <p className="footer-brand">Wijesinghe Jewelers</p>
          <p className="footer-body">
            Retail gold prices may vary by shop, city, taxes, and making charges.
          </p>
        </footer>
      </div>
    </main>
  );
}
