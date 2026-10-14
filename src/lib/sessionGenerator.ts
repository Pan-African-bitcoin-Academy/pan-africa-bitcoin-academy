/**
 * Session Generator Utility
 * Generates cohort sessions based on start/end dates
 * Rules: 3 sessions per week, excluding Sundays
 */

interface SessionDate {
  date: Date;
  sessionNumber: number;
}

/**
 * Generate session dates for a cohort
 * @param startDate - Cohort start date (inclusive)
 * @param endDate - Cohort end date (inclusive)
 * @returns Array of session dates with session numbers
 */
export function generateCohortSessions(
  startDate: Date,
  endDate: Date
): SessionDate[] {
  const sessions: SessionDate[] = [];
  let sessionNumber = 1;
  
  // Start from the start date
  let sessionDate = new Date(startDate);
  sessionDate.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  // Track sessions per week (Monday to Sunday)
  let sessionsThisWeek = 0;
  let currentWeekStart: Date | null = null;
  
  // Helper function to get next session date (add 2 days, but skip Sunday if hit)
  const getNextSessionDate = (current: Date): Date => {
    let next = new Date(current);
    // Add 2 days
    next.setDate(next.getDate() + 2);
    // If it's Sunday, skip to Monday
    if (next.getDay() === 0) {
      next.setDate(next.getDate() + 1); // Move to Monday
    }
    return next;
  };
  
  // If start date is Sunday, move to Monday
  if (sessionDate.getDay() === 0) {
    sessionDate.setDate(sessionDate.getDate() + 1);
  }
  
  while (sessionDate <= end) {
    // Determine the start of the current week (Monday)
    const dayOfWeek = sessionDate.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(sessionDate);
    weekStart.setDate(sessionDate.getDate() - daysFromMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    // Check if we've moved to a new week
    if (!currentWeekStart || weekStart.getTime() !== currentWeekStart.getTime()) {
      // New week started, reset counter
      sessionsThisWeek = 0;
      currentWeekStart = weekStart;
    }
    
    // Add session if we haven't reached 3 sessions this week
    if (sessionsThisWeek < 3) {
      sessions.push({
        date: new Date(sessionDate),
        sessionNumber: sessionNumber++,
      });
      sessionsThisWeek++;
      
      // Move to next session date
      sessionDate = getNextSessionDate(sessionDate);
    } else {
      // We've reached 3 sessions this week, move to next week's first session
      // Find next Monday
      const daysUntilMonday = (8 - sessionDate.getDay()) % 7 || 7;
      sessionDate.setDate(sessionDate.getDate() + daysUntilMonday);
      sessionsThisWeek = 0;
    }
  }
  
  return sessions;
}

/**
 * Validate cohort dates for session generation
 */
export function validateCohortDates(startDate: Date | string | null, endDate: Date | string | null): {
  valid: boolean;
  error?: string;
} {
  if (!startDate || !endDate) {
    return { valid: false, error: 'Start date and end date are required' };
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  
  if (start > end) {
    return { valid: false, error: 'Start date must be before end date' };
  }
  
  return { valid: true };
}
