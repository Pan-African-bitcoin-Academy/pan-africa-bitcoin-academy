import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_RANGES = new Set(['7', '30', '90', '180', '365', 'max']);
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

type PriceTuple = [number, number];
type OhlcTuple = [number, number, number, number, number];

function isPriceTuple(value: unknown): value is PriceTuple {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((item) => typeof item === 'number' && Number.isFinite(item))
  );
}

function isOhlcTuple(value: unknown): value is OhlcTuple {
  if (
    !Array.isArray(value) ||
    value.length !== 5 ||
    !value.every((item) => typeof item === 'number' && Number.isFinite(item))
  ) {
    return false;
  }

  const [, open, high, low, close] = value;
  return low <= Math.min(open, close) && high >= Math.max(open, close);
}

export async function GET(request: NextRequest) {
  const requestedRange = request.nextUrl.searchParams.get('days') ?? '365';
  const days = ALLOWED_RANGES.has(requestedRange) ? requestedRange : '365';

  try {
    const [marketResponse, historyResponse, ohlcResponse] = await Promise.all([
      fetch(`${COINGECKO_API}/coins/markets?vs_currency=usd&ids=bitcoin&price_change_percentage=24h`, {
        next: { revalidate: 300 },
      }),
      fetch(`${COINGECKO_API}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`, {
        next: { revalidate: 3600 },
      }),
      fetch(`${COINGECKO_API}/coins/bitcoin/ohlc?vs_currency=usd&days=${days}`, {
        next: { revalidate: 3600 },
      }),
    ]);

    if (!marketResponse.ok || !historyResponse.ok) {
      return NextResponse.json(
        { error: 'Bitcoin market data is temporarily unavailable. Please try again later.' },
        { status: 502 },
      );
    }

    const market = (await marketResponse.json()) as Array<{
      current_price: number;
      price_change_percentage_24h: number | null;
      high_24h: number | null;
      low_24h: number | null;
      last_updated: string;
    }>;
    const history = (await historyResponse.json()) as { prices?: unknown };
    const ohlc = ohlcResponse.ok ? ((await ohlcResponse.json()) as unknown) : [];
    const bitcoin = market[0];
    const prices = Array.isArray(history.prices) ? history.prices.filter(isPriceTuple) : [];
    const candles = Array.isArray(ohlc) ? ohlc.filter(isOhlcTuple) : [];
    const candleError = candles.length
      ? null
      : 'Historical candlestick data is temporarily unavailable.';

    if (
      !bitcoin ||
      !Number.isFinite(bitcoin.current_price) ||
      !prices.length
    ) {
      return NextResponse.json(
        { error: 'The market data provider returned incomplete Bitcoin data.' },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        currentPrice: bitcoin.current_price,
        change24h: bitcoin.price_change_percentage_24h,
        high24h: bitcoin.high_24h,
        low24h: bitcoin.low_24h,
        lastUpdated: bitcoin.last_updated,
        prices: prices.map(([timestamp, price]) => ({ timestamp, price })),
        candles: candles.map(([timestamp, open, high, low, close]) => ({
          timestamp,
          open,
          high,
          low,
          close,
        })),
        candleError,
        source: 'CoinGecko',
      },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
    );
  } catch (error) {
    console.error('DCA market data request failed:', error);
    return NextResponse.json(
      { error: 'Unable to load Bitcoin market data. Please try again later.' },
      { status: 502 },
    );
  }
}
