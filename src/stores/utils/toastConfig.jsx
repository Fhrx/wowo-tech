// src/utils/toastConfig.js
import toast from 'react-hot-toast';

// Helper untuk cek dark mode dari DOM
const getCurrentTheme = () => {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
};

// Base toast untuk light/dark mode
const getBaseToastStyle = () => {
  const isDarkMode = getCurrentTheme();
  
  return {
    background: isDarkMode ? '#0a0a0a' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#1f2937',
    border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    padding: '17px',
    boxShadow: isDarkMode 
      ? '0 8px 25px rgba(0, 0, 0, 0.4)' 
      : '0 8px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: '420px',
    marginTop: '16px',
    marginRight: '16px',
    top: '80px', // Offset dari navbar
    gap: '8px', // Jarak antar toast
  };
};

// Function untuk get warna berdasarkan type
const getToastColors = (type) => {
  const isDarkMode = getCurrentTheme();
  
  const colors = {
    success: {
      border: isDarkMode ? '#16a34a' : '#22c55e',
      primary: isDarkMode ? '#22c55e' : '#16a34a',
      gradient: isDarkMode 
        ? 'linear-gradient(135deg, #0a0a0a 0%, #111827 100%)' 
        : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
    },
    error: {
      border: isDarkMode ? '#dc2626' : '#ef4444',
      primary: isDarkMode ? '#ef4444' : '#dc2626',
      gradient: isDarkMode 
        ? 'linear-gradient(135deg, #0a0a0a 0%, #1f2937 100%)' 
        : 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
    },
    warning: {
      border: isDarkMode ? '#d97706' : '#f59e0b',
      primary: isDarkMode ? '#f59e0b' : '#d97706',
      gradient: isDarkMode 
        ? 'linear-gradient(135deg, #0a0a0a 0%, #1f2937 100%)' 
        : 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
    },
    info: {
      border: isDarkMode ? '#2563eb' : '#3b82f6',
      primary: isDarkMode ? '#3b82f6' : '#2563eb',
      gradient: isDarkMode 
        ? 'linear-gradient(135deg, #0a0a0a 0%, #1f2937 100%)' 
        : 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
    },
  };

  return colors[type] || colors.info;
};

// Export functions dengan X button otomatis
export const toastSuccess = (message, options = {}) => {
  const colors = getToastColors('success');
  const isDarkMode = getCurrentTheme();
  
  return toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      ...getBaseToastStyle(),
      borderLeft: `4px solid ${colors.border}`,
      background: colors.gradient,
    },
    iconTheme: {
      primary: colors.primary,
      secondary: isDarkMode ? '#0a0a0a' : '#ffffff',
    },
    // React-hot-toast v2 sudah punya close button otomatis!
    ...options
  });
};

export const toastError = (message, options = {}) => {
  const colors = getToastColors('error');
  const isDarkMode = getCurrentTheme();
  
  return toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      ...getBaseToastStyle(),
      borderLeft: `4px solid ${colors.border}`,
      background: colors.gradient,
    },
    iconTheme: {
      primary: colors.primary,
      secondary: isDarkMode ? '#0a0a0a' : '#ffffff',
    },
    ...options
  });
};

export const toastWarning = (message, options = {}) => {
  const colors = getToastColors('warning');
  
  return toast(message, {
    duration: 4500,
    position: 'top-right',
    style: {
      ...getBaseToastStyle(),
      borderLeft: `4px solid ${colors.border}`,
      background: colors.gradient,
    },
    icon: <WarningIcon />, // Icon component
    ...options
  });
};

export const toastInfo = (message, options = {}) => {
  const colors = getToastColors('info');
  
  return toast(message, {
    duration: 3500,
    position: 'top-right',
    style: {
      ...getBaseToastStyle(),
      borderLeft: `4px solid ${colors.border}`,
      background: colors.gradient,
    },
    icon: <InfoIcon />, // Icon component
    ...options
  });
};

// WowoTech specific toasts - TANPA EMOJI
export const wowotechToast = {
  // Base methods
  success: toastSuccess,
  error: toastError,
  warning: toastWarning,
  info: toastInfo,
  
  // Authentication - pakai built-in icons
  loginSuccess: () => toastSuccess('Login berhasil! Selamat datang di WowoTech'),
  
  loginError: (message = 'Email atau password salah') => toastError(message),
  
  registerSuccess: () => toastSuccess('Akun berhasil dibuat! Silakan login', { 
    duration: 5000 
  }),
  
  // Shopping
  cartAdd: (productName) => toastSuccess(`${productName} ditambahkan ke keranjang`, { 
    duration: 3000 
  }),
  
  cartRemove: (productName) => toastInfo(`${productName} dihapus dari keranjang`, {
    duration: 3000
  }),
  
  cartClear: () => toastWarning('Keranjang dikosongkan', {
    duration: 3000
  }),
  
  // Orders
  orderSuccess: () => toastSuccess('Pesanan berhasil dibuat!', { 
    duration: 6000 
  }),
  
  orderProcessing: () => toastInfo('Pesanan sedang diproses...', {
    duration: 4000
  }),
  
  // Admin actions
  productCreated: () => toastSuccess('Produk berhasil ditambahkan'),
  productUpdated: () => toastSuccess('Produk berhasil diperbarui'),
  productDeleted: () => toastWarning('Produk berhasil dihapus'),
  couponCreated: () => toastSuccess('Kupon berhasil dibuat'),
  couponDeleted: () => toastWarning('Kupon berhasil dihapus'),
  
  // System
  loading: (message = 'Memproses...') => toast.loading(message, {
    style: getBaseToastStyle(),
    duration: Infinity
  }),
  
  dismiss: toast.dismiss,
  remove: toast.remove,
};