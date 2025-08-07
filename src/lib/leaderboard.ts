import { LeaderboardEntry } from "./types";

export const saveScore = (score: number): void => {
  try {
    const scores = getLeaderboard();
    const newEntry: LeaderboardEntry = {
      score,
      date: new Date().toISOString(), // Save full ISO string to preserve time
    };

    scores.push(newEntry);
    scores.sort((a, b) => b.score - a.score); // Sort descending by score

    // Keep only top 5 scores
    const top5 = scores.slice(0, 5);

    localStorage.setItem("pangolin-leaderboard", JSON.stringify(top5));
  } catch (error) {
    console.warn("Failed to save score to localStorage:", error);
  }
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const stored = localStorage.getItem("pangolin-leaderboard");
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn("Failed to load leaderboard from localStorage:", error);
  }
  return [];
};

export const clearLeaderboard = (): void => {
  try {
    localStorage.removeItem("pangolin-leaderboard");
  } catch (error) {
    console.warn("Failed to clear leaderboard:", error);
  }
};
