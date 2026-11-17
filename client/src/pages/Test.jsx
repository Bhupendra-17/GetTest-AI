import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiArrowLeft, FiArrowRight } from "react-icons/fi";

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { questions = [], timeLimit = 60 } = location.state || {};
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const timeLeftRef = useRef(timeLimit * 60);
  const [questionTimers, setQuestionTimers] = useState(() =>
    questions.map(() => 0)
  );
  const questionTimersRef = useRef(questions.map(() => 0));
  const isSubmittingRef = useRef(false);
  const submitRef = useRef(() => {});

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!questions.length || isSubmittingRef.current) return undefined;

    const interval = setInterval(() => {
      const nextTimeLeft = Math.max(timeLeftRef.current - 1, 0);
      timeLeftRef.current = nextTimeLeft;
      setTimeLeft(nextTimeLeft);

      const nextQuestionTimers = [...questionTimersRef.current];
      nextQuestionTimers[currentIndex] = (nextQuestionTimers[currentIndex] || 0) + 1;
      questionTimersRef.current = nextQuestionTimers;
      setQuestionTimers(nextQuestionTimers);

      if (nextTimeLeft === 0) submitRef.current();
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, questions.length]);

  const handleOptionSelect = (index, option) => {
    setAnswers({ ...answers, [index]: option });
  };

  const handleClearSelection = () => {
    const updated = { ...answers };
    delete updated[currentIndex];
    setAnswers(updated);
  };

  const handleMarkForReview = (index) => {
    setMarkedForReview({ ...markedForReview, [index]: !markedForReview[index] });
  };

  const handleSubmit = () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    navigate("/score", {
      state: {
        questions,
        answers,
        timeTaken: timeLimit * 60 - timeLeftRef.current,
        questionTimers: questionTimersRef.current,
      },
    });
  };

  submitRef.current = handleSubmit;

  const handleRequestSubmit = () => setIsConfirmOpen(true);

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleRequestSubmit();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const { answered, notAnswered, marked, total } = (() => {
    let a = 0,
      n = 0,
      m = 0;
    questions.forEach((_, index) => {
      if (answers[index]) a++;
      else if (markedForReview[index]) m++;
      else n++;
    });
    return { answered: a, notAnswered: n, marked: m, total: questions.length };
  })();

  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-yellow-100 to-rose-100 flex flex-col">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-[linear-gradient(60deg,_#ffb74d,_#ff8a65,_#f06292,_#ba68c8,_#64b5f6,_#4dd0e1,_#81c784)] bg-[length:400%_400%]"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
      />

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white/40 backdrop-blur-md shadow-lg border-b border-white/30">
        <h1 className="text-2xl font-bold text-gray-800">🧠 Mock Test</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <FiClock className="text-orange-600" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={handleRequestSubmit}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:flex-row p-4 gap-6">
        {/* Question Section */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              Q{currentIndex + 1}. {currentQuestion?.text}
            </h2>
            <span className="text-sm font-semibold text-orange-600">
              ⏱ {formatTime(questionTimers[currentIndex] || 0)}
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {currentQuestion?.options?.map((option, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleOptionSelect(currentIndex, option)}
                className={`block w-full text-left px-4 py-3 rounded-xl border transition font-medium ${answers[currentIndex] === option
                  ? "bg-gradient-to-b from-green-600 to-green-400 text-white border-transparent shadow-lg"
                  : "bg-white/70 hover:bg-white border-gray-300 text-gray-700"
                  }`}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleClearSelection}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 font-semibold"
            >
              Clear Selection
            </button>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={markedForReview[currentIndex]}
                onChange={() => handleMarkForReview(currentIndex)}
                className="h-5 w-5 accent-orange-500"
              />
              <span className="font-medium text-gray-800">Mark for Review</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              <FiArrowLeft /> Previous
            </button>
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition font-semibold"
            >
              {currentIndex === questions.length - 1 ? "Finish" : "Next"}{" "}
              <FiArrowRight />
            </button>
          </div>
        </motion.div>

        {/* Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/4 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-lg mb-4 text-center text-gray-800">
              Question Navigator
            </h3>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to question ${index + 1}${answers[index] ? ", answered" : ""}${markedForReview[index] ? ", marked for review" : ""}`}
                  className={`aspect-square w-full min-w-0 flex items-center justify-center rounded-xl p-0 text-sm tabular-nums font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${answers[index]
                    ? "bg-green-500 text-white"
                    : markedForReview[index]
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-300 text-gray-800"
                    } ${currentIndex === index ? "ring-2 ring-orange-400" : ""}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                <span>Total Questions</span>
                <span className="font-bold text-blue-600">{total}</span>
              </div>
              <div className="flex justify-between bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <span>Answered</span>
                <span className="font-bold text-green-600">{answered}</span>
              </div>
              <div className="flex justify-between bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                <span>Marked</span>
                <span className="font-bold text-yellow-600">{marked}</span>
              </div>
              <div className="flex justify-between bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <span>Not Answered</span>
                <span className="font-bold text-red-500">{notAnswered}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {isConfirmOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
          onClick={() => setIsConfirmOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-confirmation-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="submit-confirmation-title" className="text-xl font-bold text-slate-900">
              Submit this test?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {answered < total
                ? `You have ${total - answered} unanswered question${total - answered === 1 ? "" : "s"}. `
                : "You have answered every question. "}
              Your answers will be final after submission.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Confirm submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
