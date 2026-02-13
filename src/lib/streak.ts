import { IUser } from "@/core/models/User";

/**
 * Validates and updates user streak based on last activity date.
 * Returns true if the user object was modified (streak reset), false otherwise.
 */
export function validateUserStreak(user: IUser): boolean {
    if (!user.stats || !user.stats.last_active_date) {
        if (user.stats && user.stats.current_streak > 0) {
            user.stats.current_streak = 0;
            return true;
        }
        return false;
    }

    const lastActiveDateStr = user.stats.last_active_date;

    // Normalize "today" to YYYY-MM-DD
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Calculate "yesterday"
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If active today or yesterday (or in the future due to timezone differences), streak is valid
    // We allow future dates because a user might be in a timezone ahead of the server
    if (lastActiveDateStr >= yesterdayStr) {
        return false;
    }

    // Otherwise, streak is broken
    if (user.stats.current_streak > 0) {
        user.stats.current_streak = 0;
        return true;
    }

    return false;
}
