import { PriceGrid } from "@/components/PriceGrid";
import { ProductPriceCalculator } from "@/components/ProductPriceCalculator";
import { MouseGlow } from "@/components/MouseGlow";
import type { GoldPriceResponse } from "@/types/gold";
import { headers } from "next/headers";
import Image from "next/image";
import logo from "@/logo.svg";

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
        {/* ── Mouse glow ── */}
        <MouseGlow />

        {/* ── Ambient background ── */}
        <div className="jewelry-ambient" aria-hidden="true">
          <div className="ambient-orb orb-1" />
          <div className="ambient-orb orb-2" />
          <div className="ambient-orb orb-3" />
          <div className="grain-overlay" />
        </div>

        {/* ── Edge lines ── */}
        <div className="top-line" aria-hidden="true" />
        <div className="bot-line" aria-hidden="true" />

        <div className="jewelry-content">

          {/* ── Header ── */}
          <header className="jewelry-header">
            <div className="logo-halo" aria-hidden="true" />
            <div className="brand-logo-wrap">
              <Image
                src={logo}
                alt="Wijesinghe Jewelers logo"
                className="brand-logo"
                priority
              />
            </div>
            <p className="brand-tagline">Est. Sri Lanka &nbsp;·&nbsp; Live Gold Prices</p>
            <h1 className="hero-title">Today&apos;s Sri Lanka Gold Rates</h1>
            <p className="hero-subtitle">
              Live 24K, 22K, 21K and 18K prices with a quick product price calculator.
            </p>
            <div className="live-badge">
              <span className="live-dot" />
              Live Rates
            </div>
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
              <span className="error-icon">◇</span>
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
            <div className="jewelry-divider footer-div" aria-hidden="true">
              <span className="div-line" />
              <span className="div-diamond sm" />
              <span className="div-line" />
            </div>
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
        <div className="jewelry-ambient" aria-hidden="true">
          <div className="ambient-orb orb-1" />
          <div className="ambient-orb orb-2" />
          <div className="grain-overlay" />
        </div>
        <div className="top-line" aria-hidden="true" />
        <div className="bot-line" aria-hidden="true" />

        <div className="jewelry-content">
          <header className="jewelry-header">
            <div className="logo-halo" aria-hidden="true" />
            <div className="brand-logo-wrap">
              <Image
                src={logo}
                alt="Wijesinghe Jewelers logo"
                className="brand-logo"
                priority
              />
            </div>
            <p className="brand-tagline">Est. Sri Lanka &nbsp;·&nbsp; Live Gold Prices</p>
            <h1 className="hero-title">Today&apos;s Sri Lanka Gold Rates</h1>
            <p className="hero-subtitle">
              Live 24K, 22K, 21K and 18K prices with a quick product price calculator.
            </p>
          </header>

          <div className="jewelry-divider" aria-hidden="true">
            <span className="div-line" />
            <span className="div-diamond" />
            <span className="div-line" />
          </div>

          <section className="jewelry-error">
            <span className="error-icon">◇</span>
            Something went wrong while loading gold prices. Please refresh the page.
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