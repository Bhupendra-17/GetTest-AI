import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiCheck, FiZap, FiShield } from "react-icons/fi";

const plans = [
  {
    id: "weekly",
    title: "Weekly Sprint",
    price: 59.0,
    tag: "7 DAYS",
    features: [
      "Full Access for 7 Days",
      "3 AI Tests Generated / Day",
      "Item-by-Item Diagnostics",
      "Standard PDF Ingestion (5MB)",
    ],
  },
  {
    id: "monthly",
    title: "Monthly Mastery",
    price: 199.0,
    tag: "MOST POPULAR",
    isPopular: true,
    features: [
      "30 Days Unlimited Testing",
      "Priority Neural Question Parsing",
      "Comprehensive Historical Analytics",
      "Sectional & Role-based Exam Mocks",
      "Early Access to Updated Models",
    ],
  },
  {
    id: "bimonthly",
    title: "Exam Marathon",
    price: 389.0,
    tag: "60 DAYS",
    features: [
      "60 Days Extended Access",
      "Bulk Notes & Slide Processing",
      "Complete Performance Heatmaps",
      "Targeted Weak Area Drills",
      "Export Test Summary PDF",
    ],
  },
];

export default function PaymentPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSelect = (plan) => {
    setSelectedPlan(plan);
    setShowConfirm(true);
    document.body.style.overflow = "hidden";
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    document.body.style.overflow = "";

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
        phone: "",
      }),
    });

    const data = await res.json();
    if (data.payment_link) {
      window.location.href = data.payment_link;
    } else {
      alert("Unable to initiate payment session. Please verify authentication.");
    }
  };

  const handleCloseModal = () => {
    setShowConfirm(false);
    setSelectedPlan(null);
    document.body.style.overflow = "";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-orange-100/40 via-amber-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100/70 inline-block mb-3">
            AFFORDABLE PRICING
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Simple, Transparent Preparation Plans
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Choose a flexible timeframe calibrated to your examination dates. Cancel anytime.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handleSelect(plan)}
              className={`relative bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 cursor-pointer border ${
                plan.isPopular
                  ? "border-orange-400 ring-2 ring-orange-400/20 shadow-xl sm:-translate-y-2"
                  : "border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {plan.tag}
                  </span>
                  {plan.isPopular && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold uppercase tracking-wider shadow-xs">
                      RECOMMENDED
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-1">{plan.title}</h2>

                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl font-extrabold text-slate-900 font-mono">
                    ₹{plan.price}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ access</span>
                </div>

                <div className="border-t border-slate-100 my-4" />

                <ul className="space-y-3 my-4 text-xs sm:text-sm text-slate-600">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <FiCheck className="text-emerald-500 text-base flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-3 rounded-full text-xs uppercase tracking-wider font-bold transition mt-6 cursor-pointer ${
                  plan.isPopular
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
              >
                Choose {plan.title}
              </button>
            </div>
          ))}
        </div>

        {/* Guarantee Note */}
        <div className="mt-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <FiShield className="text-slate-400" />
          <span>Secure checkout processed via encrypted payment gateways. Instant account activation.</span>
        </div>
      </main>

      <Footer />

      {showConfirm && (
        <ConfirmModal plan={selectedPlan} onConfirm={handleConfirm} onClose={handleCloseModal} />
      )}
    </div>
  );
}
