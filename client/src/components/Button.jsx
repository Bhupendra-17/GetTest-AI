import React from 'react';

function Button({ title, children, variant = 'outline', className = '', ...props }) {
  if (variant === 'primary') {
    return (
      <button
        type="button"
        className={`inline-flex items-center justify-center text-sm font-semibold rounded-full px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm hover:shadow transition duration-200 cursor-pointer ${className}`}
        {...props}
      >
        {title || children}
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center text-sm font-semibold border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 rounded-full px-4 py-1.5 cursor-pointer transition duration-200 shadow-xs ${className}`}
      {...props}
    >
      {title || children}
    </div>
  );
}

export default Button;