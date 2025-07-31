// pages/PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const [status, setStatus] = useState('⏳ Verifying your payment...');
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const verifyPayment = async () => {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams(location.search);
      const orderId = params.get('order_id');

      if (!orderId) {
        setStatus('❌ Invalid request. No Order ID found.');
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
          setStatus('✅ Payment Successful! Premium Activated.');
          setTimeout(() => navigate('/profile'), 4000);
        } else {
          setStatus('❌ Payment could not be verified.');
        }
      } catch (err) {
        setStatus('⚠️ Server error while verifying payment.');
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-2 text-green-700">Payment Status</h1>
        <p className="text-gray-700 text-lg">{status}</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
