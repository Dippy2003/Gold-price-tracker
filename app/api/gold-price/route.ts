import { NextResponse } from "next/server";
import { getGoldPrice } from "@/lib/gold/getGoldPrice";

// Revalidate this route every 30 minutes.
export const revalidate = 1800;

export async function GET() {
  try {
    const data = await getGoldPrice();
    const statusCode = data.status === "error" ? 500 : 200;

    return NextResponse.json(data, { status: statusCode });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected API route error";

    return NextResponse.json(
      {
        source: "Unknown",
        sourceUrl: "",
        effectiveDate: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        status: "error",
        note: `API route failed: ${message}`,
        prices: [],
      },
      { status: 500 },
    );
  }
}
