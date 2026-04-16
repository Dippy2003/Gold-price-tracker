import { PageHeader } from "@/components/PageHeader";
import { PriceGrid } from "@/components/PriceGrid";
import { ProductPriceCalculator } from "@/components/ProductPriceCalculator";
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
      : { next: { revalidate: 1800 } },
  );

  if (!response.ok)
    throw new Error(`API request failed with status ${response.status}`);

  return (await response.json()) as GoldPriceResponse;
}

export default async function Home() {
  try {
    const goldPrice = await fetchGoldPrices();

    return (
      <main className="jewelry-page">
        {/* ── Animated ring layer ── */}
        <div className="jewelry-rings" aria-hidden="true">
          <div className="ring r1" />
          <div className="ring r2 rdash" />
          <div className="ring r3" />
          <div className="ring r4 rdash" />
          <div className="ring r5" />
          <div className="ring r6 rdash" />
          <div className="ring r7" />
          <div className="particle p1" />
          <div className="particle p2" />
          <div className="particle p3" />
          <div className="particle p4" />
          <div className="particle p5" />
          <div className="particle p6" />
          <div className="glow-orb orb1" />
          <div className="glow-orb orb2" />
        </div>

        {/* Edge accent lines */}
        <div className="top-line" aria-hidden="true" />
        <div className="bot-line" aria-hidden="true" />

        <div className="jewelry-content">

          {/* ── Header ── */}
          <header className="jewelry-header">
            <div className="ornament">
              <span className="orn-line" />
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="star-icon">
                <polygon points="10,1 12.5,7.5 19,7.5 13.8,11.8 15.9,18.5 10,14.5 4.1,18.5 6.2,11.8 1,7.5 7.5,7.5" />
              </svg>
              <span className="orn-line orn-line-r" />
            </div>
            <PageHeader
              title="Wijesinghe Jewelers"
              subtitle="Modern gold rate dashboard for 24K, 22K, and 21K prices in Sri Lanka."
            />
          </header>

          {/* ── Divider ── */}
          <div className="jewelry-divider" aria-hidden="true">
            <span className="div-line" />
            <span className="div-diamond" />
            <span className="div-line" />
          </div>

          {/* ── Prices ── */}
          {goldPrice.status === "error" || goldPrice.prices.length === 0 ? (
            <section className="jewelry-error">
              We could not refresh live prices right now. Please try again in a few minutes.
            </section>
          ) : (
            <>
              <PriceGrid prices={goldPrice.prices} />
              <ProductPriceCalculator prices={goldPrice.prices} />
            </>
          )}

          {/* ── Footer ── */}
          <footer className="jewelry-footer">
            <span className="footer-badge">Est. Sri Lanka</span>
            <p className="footer-title">Disclaimer</p>
            <p className="footer-body">
              Retail gold prices may vary by shop, city, taxes, and making charges.
            </p>
            <p className="footer-brand">Wijesinghe Jewelers</p>
          </footer>

        </div>
      </main>
    );
  } catch {
    return (
      <main className="jewelry-page">
        <div className="jewelry-rings" aria-hidden="true">
          <div className="ring r1" /><div className="ring r2 rdash" />
          <div className="ring r3" /><div className="ring r4 rdash" />
          <div className="ring r5" /><div className="ring r6 rdash" />
          <div className="glow-orb orb1" /><div className="glow-orb orb2" />
        </div>
        <div className="top-line" aria-hidden="true" />
        <div className="bot-line" aria-hidden="true" />

        <div className="jewelry-content">
          <header className="jewelry-header">
            <div className="ornament">
              <span className="orn-line" />
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="star-icon">
                <polygon points="10,1 12.5,7.5 19,7.5 13.8,11.8 15.9,18.5 10,14.5 4.1,18.5 6.2,11.8 1,7.5 7.5,7.5" />
              </svg>
              <span className="orn-line orn-line-r" />
            </div>
            <PageHeader
              title="Wijesinghe Jewelers"
              subtitle="Modern gold rate dashboard for 24K, 22K, and 21K prices in Sri Lanka."
            />
          </header>

          <section className="jewelry-error">
            Something went wrong while loading the gold prices. Please refresh the page.
          </section>

          <footer className="jewelry-footer">
            <span className="footer-badge">Est. Sri Lanka</span>
            <p className="footer-title">Disclaimer</p>
            <p className="footer-body">
              Retail gold prices may vary by shop, city, taxes, and making charges.
            </p>
            <p className="footer-brand">Wijesinghe Jewelers</p>
          </footer>
        </div>
      </main>
    );
  }
}