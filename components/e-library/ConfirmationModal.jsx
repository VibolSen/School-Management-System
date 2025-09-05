import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger' }) => {
  if (!isOpen) return null;

  const buttonClasses = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500';

  const iconContainerClasses = variant === 'danger' ? 'bg-red-100' : 'bg-green-100';
  const iconClasses = variant === 'danger' ? 'text-red-600' : 'text-green-600';

  const icon = variant === 'danger' ? (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ) : (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-full overflow-y-auto transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="p-6">
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${iconContainerClasses} sm:mx-0 sm:h-10 sm:w-10`}>
              <div className={iconClasses}>{icon}</div>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-bold text-slate-900" id="confirm-modal-title">
                {title}
              </h3>
              <div className="mt-2 text-sm text-slate-500">
                {message}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-b-xl flex justify-end items-center gap-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={`px-4 py-2 border border-transparent rounded-md text-sm font-semibold text-white ${buttonClasses} focus:outline-none focus:ring-2 focus:ring-offset-2`}>
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { transform: scale(.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
