import { NextResponse } from 'next/server';

const HISTORY_START = Date.UTC(2020, 0, 1) / 1000;
const BLOCKCHAIN_API = 'https://api.blockchain.info/charts/market-price';

interface HistoricalPricePoint {
  x: number;
  y: number;
}

function isHistoricalPricePoint(value: unknown): value is HistoricalPricePoint {
  if (!value || typeof value !== 'object') return false;
  const point = value as Record<string, unknown>;
  return (
    typeof point.x === 'number' &&
    Number.isFinite(point.x) &&
    typeof point.y === 'number' &&
    Number.isFinite(point.y) &&
    point.y > 0
  );
}

export async function GET() {
  try {
    const response = await fetch(
      `${BLOCKCHAIN_API}?timespan=7years&format=json`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Historical Bitcoin prices are temporarily unavailable. Please try again later.' },
        { status: 502 },
      );
    }

    const history = (await response.json()) as { values?: unknown };
    const prices = Array.isArray(history.values)
      ? history.values
          .filter(isHistoricalPricePoint)
          .filter((point) => point.x >= HISTORY_START)
          .map(({ x, y }) => ({ timestamp: x * 1000, price: y }))
      : [];

    if (!prices.length) {
      return NextResponse.json(
        { error: 'The historical price provider returned no Bitcoin data from January 2020 onward.' },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        prices,
        availableFrom: new Date(prices[0].timestamp).toISOString().slice(0, 10),
        source: 'Blockchain.com',
      },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=21600' } },
    );
  } catch (error) {
    console.error('DCA historical price request failed:', error);
    return NextResponse.json(
      { error: 'Unable to load historical Bitcoin prices. Please try again later.' },
      { status: 502 },
    );
  }
}
