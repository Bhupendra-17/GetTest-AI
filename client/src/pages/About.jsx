import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const plans = [
    {
        id: 'weekly',
        title: 'Weekly Plan',
        price: 59.0,
        features: ['7 Days of Premium', 'Get max of 10 Mock Tests a day', 'AI Explainer for each question'],
    },
    {
        id: 'monthly',
        title: 'Monthly Plan',
        price: 199.0,
        features: ['30 Days of Premium', 'Get max of 10 Mock Tests a day', 'AI Explainer for each question'],
    },
    {
        id: 'bimonthly',
        title: '2-Month Plan',
        price: 389.0,
        features: ['60 Days of Premium', 'Get max of 10 Mock Tests a day', 'AI Explainer for each question'],
    },
];

const PaymentPlans = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleSelect = (plan) => {
        setSelectedPlan(plan);
        setShowConfirm(true);
        document.body.style.overflow = 'hidden'; // ✅ lock scroll when modal opens
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        document.body.style.overflow = ''; // ✅ restore scroll before redirect

        const token = localStorage.getItem("token");

        const res = await fetch(`${backendUrl}/create-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                plan_id: selectedPlan.id,
                amount: selectedPlan.price,
                phone: '', // optional, fill if needed
            }),
        });

        const data = await res.json();
        if (data.payment_link) {
            window.location.href = data.payment_link;
        } else {
            alert("Something went wrong.");
        }
    };


    const handleCloseModal = () => {
        setShowConfirm(false);
        setSelectedPlan(null);
        document.body.style.overflow = ''; // ✅ restore scroll when modal closes
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-orange-100 via-pink-100 to-blue-100 text-gray-800">
            <Navbar />
            <section className='p-5 mx-12 '>
                <h1 className='text-3xl text-center font-bold py-4 '>About</h1>
                <div className='p-5 rounded-2xl bg-neutral-50'>
                    <p><strong>GetTestAI</strong> is an innovative AI-powered web application designed to help students prepare for exams more effectively. It creates custom mock tests from your uploaded PDF study materials. Our platform simplifies the study process by eliminating the tedious task of creating practice questions, allowing you to focus on what matters most: learning.</p>
                    <h2 className='font-bold mt-8 '>Our Mission</h2>
                    <p>We built GetTestAI to give students a powerful tool to take control of their exam preparation. By using advanced AI, we can analyze your lecture notes, textbooks, and other study resources to generate unique practice tests tailored to your specific needs. This dynamic approach helps you identify knowledge gaps and reinforces key concepts, ensuring you're fully prepared for test day.
                    </p>
                </div>
            </section>
            <Footer />
        </div>

    );
};

export default PaymentPlans;
