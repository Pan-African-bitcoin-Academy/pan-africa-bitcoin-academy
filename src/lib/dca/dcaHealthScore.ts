import type { DcaPlan, DcaPurchase } from '@/app/dca/DcaExperience';

export interface HealthScoreResult {
  overallScore: number; // 0 - 100
  classification: 'Excellent' | 'Good' | 'Fair' | 'Needs attention' | 'Poor';
  classificationTigrinya: string;
  hasEnoughData: boolean;
  components: {
    scheduleConsistency: number; // 35% weight
    contributionConsistency: number; // 30% weight
    goalProgress: number; // 20% weight
    trackingActivity: number; // 15% weight
  };
  details: {
    onTimeContributions: number;
    dueContributions: number;
    recordedAmount: number;
    plannedAmount: number;
    currentSats: number;
    targetSats: number;
    activeTrackingPeriods: number;
    expectedTrackingPeriods: number;
  };
  insights: Array<{
    type: 'positive' | 'warning' | 'info';
    title: string;
    description: string;
  }>;
}

/**
 * Calculates the DCA Health Score based on a user's active plan, purchase history, and rolling evaluation window.
 * Formula:
 * Overall = (Schedule * 0.35) + (Contribution * 0.30) + (Goal * 0.20) + (Tracking * 0.15)
 */
export function calculateDcaHealthScore(
  plan: DcaPlan | undefined,
  purchases: DcaPurchase[],
  daysWindow: 30 | 90 | 180 = 90,
  language: 'en' | 'ti' = 'en'
): HealthScoreResult {
  // If no plan or brand new with 0 purchases and created recently
  if (!plan) {
    return {
      overallScore: 0,
      classification: 'Poor',
      classificationTigrinya: 'ደኹም',
      hasEnoughData: false,
      components: {
        scheduleConsistency: 0,
        contributionConsistency: 0,
        goalProgress: 0,
        trackingActivity: 0,
      },
      details: {
        onTimeContributions: 0,
        dueContributions: 0,
        recordedAmount: 0,
        plannedAmount: 0,
        currentSats: 0,
        targetSats: 0,
        activeTrackingPeriods: 0,
        expectedTrackingPeriods: 0,
      },
      insights: [
        {
          type: 'info',
          title: 'No Active Plan Set',
          description: 'Create a DCA plan in the planner to establish your personalized DCA Health Score.',
        },
      ],
    };
  }

  const now = new Date();
  const planStart = new Date(plan.startDate);
  const windowStart = new Date(now.getTime() - daysWindow * 24 * 60 * 60 * 1000);
  const effectiveStart = planStart > windowStart ? planStart : windowStart;

  // Determine cadence in days
  const freqDays =
    plan.frequency === 'daily'
      ? 1
      : plan.frequency === 'weekly'
      ? 7
      : plan.frequency === 'biweekly'
      ? 14
      : 30; // monthly

  const daysActive = Math.max(0, Math.floor((now.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)));
  const dueContributions = Math.max(1, Math.floor(daysActive / freqDays));

  // Purchases within evaluation window
  const windowPurchases = purchases.filter((p) => {
    const pDate = new Date(p.purchaseDate);
    return pDate >= effectiveStart && pDate <= now;
  });

  // Not enough data rule: User registered/started less than 1 cadence period ago and hasn't logged yet
  if (daysActive < freqDays && windowPurchases.length === 0) {
    return {
      overallScore: 100,
      classification: 'Good',
      classificationTigrinya: 'ጽቡቕ',
      hasEnoughData: false,
      components: {
        scheduleConsistency: 100,
        contributionConsistency: 100,
        goalProgress: 100,
        trackingActivity: 100,
      },
      details: {
        onTimeContributions: 0,
        dueContributions: 0,
        recordedAmount: 0,
        plannedAmount: plan.contributionAmount,
        currentSats: 0,
        targetSats: 1000000,
        activeTrackingPeriods: 0,
        expectedTrackingPeriods: 1,
      },
      insights: [
        {
          type: 'info',
          title: 'Getting Started',
          description: 'Complete and record your first contribution period to establish your active health score.',
        },
      ],
    };
  }

  // 1. Schedule Consistency (35% weight)
  // Evaluates on-time contribution events vs due periods
  const onTimeCount = Math.min(dueContributions, windowPurchases.length);
  const scheduleConsistency = Math.round(Math.min(100, (onTimeCount / dueContributions) * 100));

  // 2. Contribution Consistency (30% weight)
  // Compares total amount recorded vs planned recurring amount
  const plannedAmount = dueContributions * (plan.contributionAmount || 1);
  const recordedAmount = windowPurchases.reduce((acc, p) => acc + (p.amountUsd || 0), 0);
  const contributionConsistency = Math.round(Math.min(100, (recordedAmount / Math.max(1, plannedAmount)) * 100));

  // 3. Goal Progress (20% weight)
  // Accumulation progress against plan's projected or target satoshis (or initial target of 0.01 BTC if unspecified)
  const totalSatsAccumulated = purchases.reduce((acc, p) => acc + Math.round((p.btcReceived || 0) * 100_000_000), 0);
  // Target: based on planned accumulation over duration or default 1,000,000 sats
  const targetSats = Math.max(500000, Math.round(((plan.contributionAmount * 52) / 80000) * 100_000_000));
  const goalProgress = Math.round(Math.min(100, (totalSatsAccumulated / targetSats) * 100));

  // 4. Tracking Activity (15% weight)
  // Up-to-date logging regularity without multi-week silence
  const expectedTrackingPeriods = dueContributions;
  const activeTrackingPeriods = Math.min(expectedTrackingPeriods, windowPurchases.length);
  const trackingActivity = Math.round(Math.min(100, (activeTrackingPeriods / Math.max(1, expectedTrackingPeriods)) * 100));

  // Weighted overall calculation
  const overall = Math.round(
    scheduleConsistency * 0.35 +
    contributionConsistency * 0.3 +
    goalProgress * 0.2 +
    trackingActivity * 0.15
  );

  // Classification
  let classification: HealthScoreResult['classification'] = 'Poor';
  let classificationTigrinya = 'ደኹም';
  if (overall >= 90) {
    classification = 'Excellent';
    classificationTigrinya = 'ብሉጽ';
  } else if (overall >= 75) {
    classification = 'Good';
    classificationTigrinya = 'ጽቡቕ';
  } else if (overall >= 60) {
    classification = 'Fair';
    classificationTigrinya = 'ማእከላይ';
  } else if (overall >= 40) {
    classification = 'Needs attention';
    classificationTigrinya = 'ትኲረት የድሊ';
  }

  // Actionable Insights
  const isTi = language === 'ti';
  const insights: HealthScoreResult['insights'] = [];

  if (scheduleConsistency >= 85) {
    insights.push({
      type: 'positive',
      title: isTi ? 'ጽኑዕ ስሩዕነት መደብ' : 'Strong Schedule Discipline',
      description: isTi
        ? `ካብ ዝሓለፈ ${dueContributions} ዝተመደበልካ ዕድጊ፡ ነተን ${onTimeCount} ብግዜአን መዝጊብካየን።`
        : `You logged ${onTimeCount} of your last ${dueContributions} scheduled contributions on time.`,
    });
  } else {
    insights.push({
      type: 'warning',
      title: isTi ? 'ዝተዘለለ ስሩዕ ኣበርክቶታት' : 'Missed Scheduled Contributions',
      description: isTi
        ? `ኣብ ዝሓለፉ ${daysWindow} መዓልታት ${dueContributions - onTimeCount} ዝተመደቡ እዋናት ዕድጊ ሓሊፎምኻ።`
        : `You missed ${dueContributions - onTimeCount} scheduled contribution periods in the last ${daysWindow} days.`,
    });
  }

  if (contributionConsistency >= 90) {
    insights.push({
      type: 'positive',
      title: isTi ? 'እሙን መጠን ኣበርክቶ' : 'Reliable Contribution Volume',
      description: isTi
        ? `${contributionConsistency}% ካብቲ ዝወጠንካዮ $${plannedAmount.toLocaleString()} USD በጀት በጺሕካ ኣለኻ።`
        : `You reached ${contributionConsistency}% of your planned $${plannedAmount.toLocaleString()} USD budget.`,
    });
  } else if (contributionConsistency < 75) {
    insights.push({
      type: 'warning',
      title: isTi ? 'ካብቲ መደብ ዝወሓደ ኣበርክቶ' : 'Under-contributed Relative to Plan',
      description: isTi
        ? `ካብቲ ዝተመደበ $${plannedAmount.toLocaleString()} USD፡ $${recordedAmount.toLocaleString()} USD ጥራይ ተመዝጊቡ።`
        : `Recorded $${recordedAmount.toLocaleString()} out of $${plannedAmount.toLocaleString()} USD scheduled for this window.`,
    });
  }

  insights.push({
    type: 'info',
    title: isTi ? 'ምዕባለ ሸቶ' : 'Goal Progression',
    description: isTi
      ? `${goalProgress}% ካብቲ ዝመረጽካዮ ናይ ምእካብ ሸቶ በጺሕካ ኣለኻ (${(totalSatsAccumulated / 100_000_000).toFixed(4)} BTC ተኣኪቡ)።`
      : `You have reached ${goalProgress}% of your accumulation target (${(totalSatsAccumulated / 100_000_000).toFixed(4)} BTC accumulated).`,
  });

  return {
    overallScore: overall,
    classification,
    classificationTigrinya,
    hasEnoughData: true,
    components: {
      scheduleConsistency,
      contributionConsistency,
      goalProgress,
      trackingActivity,
    },
    details: {
      onTimeContributions: onTimeCount,
      dueContributions,
      recordedAmount,
      plannedAmount,
      currentSats: totalSatsAccumulated,
      targetSats,
      activeTrackingPeriods,
      expectedTrackingPeriods,
    },
    insights,
  };
}
