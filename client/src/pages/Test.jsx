import React, { useState } from 'react';
import axios from 'axios';

const Test = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/generate-questions/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const generatedQuestions = response.data.questions;
            setQuestions(generatedQuestions);
        } catch (error) {
            console.error('Error generating questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionIndex, option) => {
        setSelectedAnswers({ ...selectedAnswers, [questionIndex]: option });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        alert('Test submitted!');
        // Implement further submission logic as needed
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (questions.length === 0) {
        return (
            <div>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload and Generate Questions</button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>
            <div className='w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 text-center'>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>Mock Test</h2>
                <div className='p-4 bg-gray-50 rounded-lg shadow-md'>
                    <h3 className='text-xl font-semibold mb-4'>{currentQuestion.text}</h3>
                    <div className='flex flex-col space-y-2'>
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                className={`py-2 px-4 rounded-lg shadow ${
                                    selectedAnswers[currentQuestionIndex] === option
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                                onClick={() => handleOptionSelect(currentQuestionIndex, option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
                <div className='flex justify-between mt-6'>
                    <button
                        onClick={handlePrev}
                        className='bg-gray-300 px-4 py-2 rounded-lg shadow'
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </button>
                    {currentQuestionIndex === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            className='bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600'
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className='bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600'
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Test;
