import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function PaymentSuccess() {
  const [status, setStatus] = useState("VERIFYING TRANSACTION...");
  const [isSuccess, setIsSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const verifyPayment = async () => {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams(location.search);
      const orderId = params.get("order_id");

      if (!orderId) {
        setStatus("INVALID TRANSACTION REQUEST // ORDER ID NOT FOUND");
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/verify-payment?order_id=${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.success) {
          setStatus("TRANSACTION CONFIRMED // PREMIUM ACTIVATED");
          setIsSuccess(true);
          setTimeout(() => navigate("/profile"), 3000);
        } else {
          setStatus("PAYMENT VERIFICATION FAILED");
        }
      } catch (err) {
        setStatus("TELEMETRY ERROR DURING PAYMENT VERIFICATION");
      }
    };

    verifyPayment();
  }, [location, navigate, backendUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4 font-sans">
      <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full">
        <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest block mb-2">
          PAYMENT GATEWAY
        </span>
        <h1 className="text-xl font-bold text-white mb-4">
          {isSuccess ? "Activation Complete" : "Payment Verification"}
        </h1>
        <div className="p-3 rounded-xl bg-slate-950 border border-white/5 font-mono text-xs text-slate-300 mb-6">
          {status}
        </div>
        <Link
          to="/profile"
          className="inline-block w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-mono text-xs uppercase tracking-wider font-bold transition"
        >
          Proceed to Dashboard →
        </Link>
      </div>
    </div>
  );
}
