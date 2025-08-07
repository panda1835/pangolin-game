export type FactType = {
  title: string;
  description: string;
  type: "fact" | "threat" | "conservation" | "poaching" | "shield";
};

export interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface LeaderboardEntry {
  score: number;
  date: string;
}
