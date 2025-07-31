// pages/PaymentFailure.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/pricing'), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-yellow-100">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-2 text-red-700">Payment Failed</h1>
        <p className="text-gray-700 text-lg">Transaction was not successful. Redirecting you back...</p>
      </div>
    </div>
  );
};

export default PaymentFailure;
