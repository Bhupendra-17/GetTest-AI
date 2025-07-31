import { useState } from 'react';
import { FiXCircle } from 'react-icons/fi';

const ConfirmModal = ({ plan, onConfirm, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    document.body.style.overflow = '';
    onClose();
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError('');
      if (onConfirm) await onConfirm(); // call parent handler
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <FiXCircle size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Your Plan</h2>
          <p className="text-gray-600 text-sm max-w-xs mx-auto">
            You’ve selected <span className="font-medium">{plan.title}</span> for{' '}
            <span className="font-medium">₹{plan.price}</span>. Confirm to proceed.
          </p>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-medium shadow-md"
          >
            {loading ? 'Redirecting...' : 'Confirm & Pay'}
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-medium border"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
