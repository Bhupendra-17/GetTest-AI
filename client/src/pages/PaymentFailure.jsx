import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function PaymentFailure() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/pricing"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4 font-sans">
      <div className="bg-slate-900 border border-red-500/30 p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full">
        <span className="font-mono text-[10px] text-red-400 uppercase tracking-widest block mb-2">
          TRANSACTION ABORTED
        </span>
        <h1 className="text-xl font-bold text-white mb-2">Payment Incomplete</h1>
        <p className="text-xs text-slate-400 mb-6">
          The transaction was interrupted or not authorized. Returning you to subscription plans...
        </p>
        <Link
          to="/pricing"
          className="inline-block w-full py-2.5 rounded-xl bg-slate-950 border border-white/10 hover:border-white/20 font-mono text-xs uppercase tracking-wider text-slate-300 hover:text-white transition"
        >
          Return to Pricing Plans
        </Link>
      </div>
    </div>
  );
}
