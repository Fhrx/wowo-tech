// src/utils/ToastComponent.jsx
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export const ToastWithClose = ({ children, toastId }) => {
  const handleClose = () => {
    toast.dismiss(toastId);
  };

  return (
    <div className="relative group">
      {children}
      <button
        onClick={handleClose}
        className="absolute right-2 top-2 p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Close toast"
      >
        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
};