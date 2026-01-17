
import { IUser } from "@/core/models/User";

/**
 * Validates and updates user streak based on activity history.
 * Returns true if the user object was modified (streak reset), false otherwise.
 * 
 * Logic:
 * 1. Get "Today" and "Yesterday" in UTC (consistent with attempts route).
 * 2. Check the last activity date from the heatmap.
 * 3. If last activity was before yesterday, the streak is broken -> reset to 0.
 * 
 * Note: We do not increment streak here. Streak increments only happen on active submission.
 * We only handle breaking the streak lazily.
 */
export function validateUserStreak(user: IUser): boolean {
    if (!user.dash || !user.dash.heatmap || user.dash.heatmap.length === 0) {
        if (user.dash.streak > 0) {
            user.dash.streak = 0;
            return true;
        }
        return false;
    }

    // Sort heatmap by date descending to find last active date
    // (Assuming heatmap might not be sorted, though typically it is appended to)
    // Actually, finding the max date string is safer.
    const dates = user.dash.heatmap.map(h => h.date).sort();
    const lastActiveDateStr = dates[dates.length - 1];

    if (!lastActiveDateStr) {
        if (user.dash.streak > 0) {
            user.dash.streak = 0;
            return true;
        }
        return false;
    }

    const lastActive = new Date(lastActiveDateStr);

    // Normalize to UTC midnight for comparison
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const today = new Date(todayStr); // UTC midnight

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If active today or yesterday, streak is kept.
    // So if lastActive < yesterday, streak is broken.
    if (lastActiveDateStr === todayStr || lastActiveDateStr === yesterdayStr) {
        return false;
    }

    // Streak broken
    if (user.dash.streak !== 0) {
        user.dash.streak = 0;
        return true;
    }

    return false;
}
