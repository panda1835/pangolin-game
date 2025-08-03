import { useState, useEffect } from "react";
import { Quiz } from "@/lib/types";
import { pangolinQuizzes } from "@/lib/quizzes";

interface UseLivesAndQuizProps {
  score: number;
  isGameOver: boolean;
  onPause?: () => void;
  onResume?: () => void;
}

export const useLivesAndQuiz = ({
  score,
  isGameOver,
  onPause,
  onResume,
}: UseLivesAndQuizProps) => {
  const [lives, setLives] = useState(1);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [lastQuizScore, setLastQuizScore] = useState(0);
  const [usedQuizzes, setUsedQuizzes] = useState<Set<number>>(new Set());

  // Check if quiz should be shown based on score
  useEffect(() => {
    if (isGameOver || showQuiz) return;

    // Check if user has crossed a multiple of 50 since the last quiz
    const currentMilestone = Math.floor(score / 50) * 50;
    const lastMilestone = Math.floor(lastQuizScore / 50) * 50;

    const shouldShowQuiz =
      score > 0 &&
      currentMilestone > lastMilestone && // Crossed a new 50-point milestone
      currentMilestone >= 50; // First milestone is at 50

    if (shouldShowQuiz) {
      // Get unused quizzes
      const availableQuizzes = pangolinQuizzes.filter(
        (quiz) => !usedQuizzes.has(quiz.id)
      );

      if (availableQuizzes.length === 0) {
        // Reset used quizzes if all have been used
        setUsedQuizzes(new Set());
        setCurrentQuiz(
          pangolinQuizzes[Math.floor(Math.random() * pangolinQuizzes.length)]
        );
      } else {
        const randomQuiz =
          availableQuizzes[Math.floor(Math.random() * availableQuizzes.length)];
        setCurrentQuiz(randomQuiz);
      }

      setLastQuizScore(currentMilestone); // Store the milestone, not the exact score
      setShowQuiz(true);
      onPause?.();
    }
  }, [score, isGameOver, showQuiz, lastQuizScore, usedQuizzes, onPause]);

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (currentQuiz) {
      setUsedQuizzes((prev) => new Set([...prev, currentQuiz.id]));
    }

    if (isCorrect && lives < 3) {
      setLives((prev) => Math.min(prev + 1, 3));
    }

    // Don't close the quiz immediately - let the user see the result
    // The quiz will be closed when they click the close button
  };

  const handleQuizClose = () => {
    if (currentQuiz) {
      setUsedQuizzes((prev) => new Set([...prev, currentQuiz.id]));
    }

    setShowQuiz(false);
    setCurrentQuiz(null);
    onResume?.();
  };

  const loseLife = () => {
    const newLives = Math.max(lives - 1, 0);
    setLives(newLives);
    return newLives <= 0; // Return true if game should end
  };

  const resetLives = () => {
    setLives(1);
    setLastQuizScore(0);
    setUsedQuizzes(new Set());
  };

  return {
    lives,
    currentQuiz,
    showQuiz,
    handleQuizAnswer,
    handleQuizClose,
    loseLife,
    resetLives,
  };
};
