// src/utils/toastConfig.js
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, ShoppingCart, UserCheck, Package } from 'lucide-react';

// Base toast dengan tema WowoTech (hitam-merah)
const baseToastStyle = {
  background: '#0a0a0a',
  color: '#ffffff',
  border: '1px solid #262626',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '500',
  padding: '14px 18px',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
};

export const toastSuccess = (message, options = {}) => {
  return toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      ...baseToastStyle,
      borderLeft: '4px solid #22c55e',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 100%)',
    },
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    iconTheme: {
      primary: '#22c55e',
      secondary: '#0a0a0a',
    },
    ...options
  });
};

export const toastError = (message, options = {}) => {
  return toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      ...baseToastStyle,
      borderLeft: '4px solid #ef4444',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1f2937 100%)',
    },
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    iconTheme: {
      primary: '#ef4444',
      secondary: '#0a0a0a',
    },
    ...options
  });
};

export const toastWarning = (message, options = {}) => {
  return toast(message, {
    duration: 4500,
    position: 'top-right',
    style: {
      ...baseToastStyle,
      borderLeft: '4px solid #f59e0b',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1f2937 100%)',
    },
    icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    ...options
  });
};

export const toastInfo = (message, options = {}) => {
  return toast(message, {
    duration: 3500,
    position: 'top-right',
    style: {
      ...baseToastStyle,
      borderLeft: '4px solid #3b82f6',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1f2937 100%)',
    },
    icon: <Info className="w-5 h-5 text-blue-500" />,
    ...options
  });
};

// WowoTech specific toasts dengan icon Lucide React
export const wowotechToast = {
  // Base methods
  success: toastSuccess,
  error: toastError,
  warning: toastWarning,
  info: toastInfo,
  
  // Authentication
  loginSuccess: () => toastSuccess('Login berhasil! Selamat datang di WowoTech', { 
    icon: <UserCheck className="w-5 h-5 text-green-500" />,
    style: {
      ...baseToastStyle,
      borderLeft: '4px solid #dc2626',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 100%)',
      borderTop: '1px solid rgba(220, 38, 38, 0.3)',
    }
  }),
  
  loginError: (message = 'Email atau password salah') => toastError(message, {
    icon: <XCircle className="w-5 h-5 text-red-500" />
  }),
  
  registerSuccess: () => toastSuccess('Akun berhasil dibuat! Silakan login dengan akun Anda', { 
    icon: <UserCheck className="w-5 h-5 text-green-500" />,
    duration: 5000,
    style: {
      ...baseToastStyle,
      borderLeft: '4px solid #dc2626',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 100%)',
    }
  }),
  
  // Shopping
  cartAdd: (productName) => toastSuccess(`${productName} berhasil ditambahkan ke keranjang`, { 
    icon: <ShoppingCart className="w-5 h-5 text-green-500" />,
    duration: 3000,
    style: {
      ...baseToastStyle,
      borderLeft: '4px solid #dc2626',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 100%)',
    }
  }),
  
  cartRemove: (productName) => toastInfo(`${productName} dihapus dari keranjang`, {
    icon: <ShoppingCart className="w-5 h-5 text-gray-400" />,
    duration: 3000
  }),
  
  cartClear: () => toastWarning('Keranjang berhasil dikosongkan', {
    icon: <ShoppingCart className="w-5 h-5 text-yellow-500" />,
    duration: 3000
  }),
  
  // Orders
  orderSuccess: () => toastSuccess('Pesanan berhasil dibuat! Invoice dapat dilihat di halaman orders', { 
    icon: <Package className="w-5 h-5 text-green-500" />,
    duration: 6000,
    style: {
      ...baseToastStyle,
      borderLeft: '4px solid #dc2626',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 100%)',
      borderTop: '1px solid rgba(220, 38, 38, 0.3)',
    }
  }),
  
  orderProcessing: () => toastInfo('Pesanan sedang diproses...', {
    icon: <Package className="w-5 h-5 text-blue-500" />,
    duration: 4000
  }),
  
  // Admin actions
  productCreated: () => toastSuccess('Produk berhasil ditambahkan', {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />
  }),
  
  productUpdated: () => toastSuccess('Produk berhasil diperbarui', {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />
  }),
  
  productDeleted: () => toastWarning('Produk berhasil dihapus', {
    icon: <CheckCircle className="w-5 h-5 text-yellow-500" />
  }),
  
  couponCreated: () => toastSuccess('Kupon berhasil dibuat', {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />
  }),
  
  couponDeleted: () => toastWarning('Kupon berhasil dihapus', {
    icon: <CheckCircle className="w-5 h-5 text-yellow-500" />
  }),
  
  // System
  loading: (message = 'Memproses...') => toast.loading(message, {
    style: baseToastStyle,
    duration: Infinity
  }),
  
  dismiss: toast.dismiss,
};