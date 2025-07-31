import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const plans = [
    {
        id: 'weekly',
        title: 'Weekly Plan',
        price: 59.0,
        features: ['7 Days of Premium', 'Get max of 3 Mock Tests a day', 'AI Explainer'],
    },
    {
        id: 'monthly',
        title: 'Monthly Plan',
        price: 199.0,
        features: ['30 Days of Premium', 'Get max of 3 Mock Tests a day', 'AI Explainer'],
    },
    {
        id: 'bimonthly',
        title: '2-Month Plan',
        price: 389.0,
        features: ['60 Days of Premium', 'Get max of 3 Mock Tests a day', 'AI Explainer'],
    },
];

const PaymentPlans = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSelect = (plan) => {
        setSelectedPlan(plan);
        setShowConfirm(true);
        document.body.style.overflow = 'hidden'; // ✅ lock scroll when modal opens
    };

    const handleConfirm = async () => {
        setShowConfirm(false);
        document.body.style.overflow = ''; // ✅ restore scroll before redirect

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8000/create-payment", {
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

            <section className="py-12 text-center">
                <h1 className="text-5xl font-extrabold mb-2">Choose Your Plan</h1>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    Upgrade to Premium with flexible options that suit your schedule and budget.
                </p>
            </section>

            <main className="max-w-6xl mx-auto px-4 pb-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                {plans.map(plan => (
                    <div
                        key={plan.id}
                        onClick={() => handleSelect(plan)}
                        className={`
          relative border-2 rounded-2xl p-8 text-center transition-transform transform hover:scale-105 cursor-pointer
          ${selectedPlan?.id === plan.id ? 'border-orange-500 shadow-2xl bg-white/90' : 'border-white/30 bg-white/80'}
        `}
                    >
                        {plan.id === 'monthly' && (
                            <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                                Most Popular
                            </div>
                        )}
                        <h2 className="text-2xl font-extrabold mb-4">{plan.title}</h2>
                        <p className="text-4xl font-bold text-orange-500 mb-6">₹{plan.price}</p>
                        <ul className="text-sm text-gray-700 space-y-3 mb-6">
                            {plan.features.map((f, i) => (
                                <li key={i} className="flex items-start pl-4">
                                    <span className="text-green-600 mr-2 mt-1">✓</span>{f}
                                </li>
                            ))}
                        </ul>
                        <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold">
                            Choose Plan
                        </button>
                    </div>
                ))}
            </main>

            <Footer />

            <ConfirmModal plan={selectedPlan} onConfirm={handleConfirm} onClose={handleCloseModal} />
        </div>

    );
};

export default PaymentPlans;
