import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Quiz } from "@/lib/types";
import HoverSoundWrapper from "@/components/common/HoverSoundWrapper";

interface QuizModalProps {
  quiz: Quiz;
  isVisible: boolean;
  soundOff: boolean;
  onAnswer: (isCorrect: boolean) => void;
  onClose: () => void;
}

export const QuizModal = ({
  quiz,
  isVisible,
  soundOff,
  onAnswer,
  onClose,
}: QuizModalProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setScale(0);
      setSelectedAnswer(null);
      setShowResult(false);
      // Animate scale from 0 to 1
      const timer = setTimeout(() => setScale(1), 50);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleAnswerClick = (answerIndex: number) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === quiz.correctAnswerIndex;

    // Call onAnswer immediately when showing result, but don't close the modal
    onAnswer(isCorrect);
  };

  const getAnswerImage = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index
        ? "/image/AnswerHover.png"
        : "/image/Answer.png";
    }

    if (index === quiz.correctAnswerIndex) {
      return "/image/AnswerCorrect.png";
    }

    if (selectedAnswer === index && index !== quiz.correctAnswerIndex) {
      return "/image/AnswerIncorrect.png";
    }

    return "/image/Answer.png";
  };

  const getQuestionBoardImage = () => {
    if (!showResult) {
      return "/image/QuestionBoard.png";
    }

    const isCorrect = selectedAnswer === quiz.correctAnswerIndex;
    return isCorrect
      ? "/image/CorrectQuestionBoard.png"
      : "/image/IncorrectQuestionBoard.png";
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Game Background */}
      <div className="absolute inset-0 bg-repeat-y bg-[url('/image/GameBackground.png')]" />

      <div
        className="relative transition-transform duration-500 ease-out"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Question Board */}
        <div className="relative w-[600px] h-[400px]">
          <Image
            unoptimized
            src={getQuestionBoardImage()}
            alt="Question Board"
            fill
            className="object-contain"
          />

          {/* Close Button */}
          {!showResult ? (
            <div></div>
          ) : (
            <HoverSoundWrapper soundSrc="/audio/hover.m4a" soundOff={soundOff}>
              <div
                className="absolute top-8 right-3 cursor-pointer z-10"
                onClick={onClose}
              >
                <Image
                  unoptimized
                  src="/image/Close.png"
                  alt="Close"
                  width={50}
                  height={50}
                  className="object-contain hover:scale-110 transition-transform"
                />
              </div>
            </HoverSoundWrapper>
          )}

          {/* Question Text */}
          <div className="absolute top-28 left-8 right-8 text-center">
            <p className="text-2xl font-bold text-white mb-6">
              {quiz.question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="absolute bottom-16 left-8 right-8 grid grid-cols-2 gap-4">
            {quiz.options.map((option, index) => (
              <HoverSoundWrapper
                key={index}
                soundSrc="/audio/hover.m4a"
                soundOff={soundOff}
              >
                <div
                  className="relative cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleAnswerClick(index)}
                >
                  <div className="relative w-full h-16">
                    <Image
                      unoptimized
                      src={getAnswerImage(index)}
                      alt={`Answer ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-black font-semibold text-base px-2 text-center">
                        {option}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverSoundWrapper>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
