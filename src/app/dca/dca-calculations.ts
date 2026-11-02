export type DcaFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface ScheduledPurchase {
  date: string;
  contribution: number;
  price: number;
  fees: number;
  btc: number;
  cumulativeContribution: number;
  cumulativeBtc: number;
  portfolioValue: number;
}

export interface DcaSimulation {
  purchases: ScheduledPurchase[];
  totalContributions: number;
  totalFees: number;
  totalBtc: number;
  averagePrice: number;
  endPrice: number;
  portfolioValue: number;
  profitLoss: number;
  skippedPurchases: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getScheduledDates(
  startDate: string,
  endDate: string,
  frequency: DcaFrequency,
): string[] {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || start > end) {
    return [];
  }

  const dates: string[] = [];
  let current = new Date(start);
  const originalDay = start.getUTCDate();

  while (current <= end && dates.length < 10_000) {
    dates.push(toDateInputValue(current));

    if (frequency === 'daily') {
      current = new Date(current.getTime() + DAY_MS);
    } else if (frequency === 'weekly' || frequency === 'biweekly') {
      current = new Date(current.getTime() + (frequency === 'weekly' ? 7 : 14) * DAY_MS);
    } else {
      const nextMonth = current.getUTCMonth() + 1;
      const year = current.getUTCFullYear() + Math.floor(nextMonth / 12);
      const month = nextMonth % 12;
      const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      current = new Date(Date.UTC(year, month, Math.min(originalDay, lastDay)));
    }
  }

  return dates;
}

function findPriceForDate(date: string, prices: PricePoint[]): PricePoint | null {
  const target = parseDate(date).getTime();
  let closest: PricePoint | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const point of prices) {
    const distance = Math.abs(point.timestamp - target);
    if (distance < closestDistance) {
      closest = point;
      closestDistance = distance;
    }
  }

  return closest && closestDistance <= 3 * DAY_MS ? closest : null;
}

export function simulateDca({
  startDate,
  endDate,
  contribution,
  frequency,
  feePercent,
  initialContribution = 0,
  prices,
}: {
  startDate: string;
  endDate: string;
  contribution: number;
  frequency: DcaFrequency;
  feePercent: number;
  initialContribution?: number;
  prices: PricePoint[];
}): DcaSimulation {
  const dates = getScheduledDates(startDate, endDate, frequency);
  const allPurchases = [
    ...(initialContribution > 0 ? [{ date: startDate, contribution: initialContribution }] : []),
    ...dates.map((date) => ({ date, contribution })),
  ];
  const sortedPrices = [...prices].sort((a, b) => a.timestamp - b.timestamp);
  const endDateMs = parseDate(endDate).getTime() + DAY_MS - 1;
  const endPricePoint = sortedPrices.reduce<PricePoint | null>((latest, point) => {
    if (point.timestamp <= endDateMs && (!latest || point.timestamp > latest.timestamp)) return point;
    return latest;
  }, null);

  let totalContributions = 0;
  let totalFees = 0;
  let totalBtc = 0;
  let skippedPurchases = 0;
  const purchases: ScheduledPurchase[] = [];

  for (const scheduled of allPurchases) {
    const pricePoint = findPriceForDate(scheduled.date, sortedPrices);
    if (!pricePoint || pricePoint.price <= 0) {
      skippedPurchases += 1;
      continue;
    }

    const fees = scheduled.contribution * feePercent / 100;
    const btc = (scheduled.contribution - fees) / pricePoint.price;
    totalContributions += scheduled.contribution;
    totalFees += fees;
    totalBtc += btc;
    purchases.push({
      date: scheduled.date,
      contribution: scheduled.contribution,
      price: pricePoint.price,
      fees,
      btc,
      cumulativeContribution: totalContributions,
      cumulativeBtc: totalBtc,
      portfolioValue: 0,
    });
  }

  const endPrice = endPricePoint?.price ?? 0;
  for (const purchase of purchases) {
    purchase.portfolioValue = purchase.cumulativeBtc * endPrice;
  }

  const portfolioValue = totalBtc * endPrice;
  return {
    purchases,
    totalContributions,
    totalFees,
    totalBtc,
    averagePrice: totalBtc > 0 ? totalContributions / totalBtc : 0,
    endPrice,
    portfolioValue,
    profitLoss: portfolioValue - totalContributions,
    skippedPurchases,
  };
}

export function getNextPurchaseDate(
  startDate: string,
  frequency: DcaFrequency,
  fromDate = new Date(),
): string | null {
  const today = toDateInputValue(fromDate);
  if (startDate >= today) return startDate;
  const searchEnd = toDateInputValue(new Date(fromDate.getTime() + 32 * DAY_MS));
  return getScheduledDates(startDate, searchEnd, frequency).find((date) => date >= today) ?? null;
}
