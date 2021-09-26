import React, { useState } from "react";

import { fetchQuizQuestions } from "./API";
//Components
import QuestionCard from "./components/QuestionCard";
//Types
import { Difficulty, QuestionState, AnswerObject } from "./API";
//styles
import { GlobalStyle, Wrapper } from "./App.styles";

const TOTAL_QUESTIONS = 10;

const App = () => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuestionState[]>([]);
    const [number, setNumber] = useState(0);
    const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
    const [score, setScores] = useState(0);
    const [gameOver, setGameOver] = useState(true);

    console.log(questions);

    const startTrivia = async () => {
        setLoading(true);
        setGameOver(false);

        const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.MEDIUM);

        setQuestions(newQuestions);
        setScores(0);
        setUserAnswers([]);
        setNumber(0);
        setLoading(false);
    };

    const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!gameOver) {
            const answer = e.currentTarget.value;
            const correct = questions[number].correct_answer === answer;
            if (correct) setScores(prevScores => prevScores + 1);

            const answerObject = {
                question: questions[number].question,
                answer: answer,
                correct: correct,
                correctAnswer: questions[number].correct_answer,
            };

            setUserAnswers(prev => [...prev, answerObject]);
        }
    };

    const nextQuestion = () => {
        const nextQuestion = number + 1;

        if (nextQuestion === TOTAL_QUESTIONS) {
            setGameOver(true);
        } else {
            setNumber(nextQuestion);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Wrapper>
                <h1>react quiz</h1>
                {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
                    <button className="start" onClick={startTrivia}>
                        Start
                    </button>
                ) : null}
                {!gameOver && <p className="score">Score: {score}</p>}
                {loading && <p>loading questions ...</p>}
                {!gameOver && !loading && (
                    <QuestionCard
                        questionNr={number + 1}
                        totalQuestions={TOTAL_QUESTIONS}
                        question={questions[number].question}
                        answers={questions[number].answers}
                        userAnswer={userAnswers ? userAnswers[number] : undefined}
                        callback={checkAnswer}
                    />
                )}
                {!gameOver &&
                    !loading &&
                    userAnswers.length === number + 1 &&
                    number !== TOTAL_QUESTIONS - 1 && (
                        <button className="next" onClick={nextQuestion}>
                            Next Question
                        </button>
                    )}
            </Wrapper>
        </>
    );
};

export default App;
