import toast, { ToastOptions } from "react-hot-toast";

export type ToastType = 'success' | 'error' | 'default';

export const Toasters = (
  type: ToastType,
  message?: string,
  duration: number = 5000
): string => {
  switch (type) {
    case "success": {
      const toastOptions: ToastOptions = {
        duration: duration,
        style: {
          border: '1px solid #4ADE80',
          padding: '16px',
          color: '#166534',
          backgroundColor: '#ECFDF5',
        },
        iconTheme: {
          primary: '#166534',
          secondary: '#F0FDF4',
        },
      };
      return toast.success(message || 'Operación exitosa', toastOptions);
    }
    case "error": {
      const toastOptions: ToastOptions = {
        duration: duration,
        style: {
          border: '1px solid #F87171',
          padding: '16px',
          color: '#991B1B',
          backgroundColor: '#FEF2F2',
        },
        iconTheme: {
          primary: '#991B1B',
          secondary: '#FEF2F2',
        },
      };
      return toast.error(message || 'Ha ocurrido un error', toastOptions);
    }
    default: {
      const toastOptions: ToastOptions = {
        duration: duration,
      };
      return toast(message || 'Notificación', toastOptions);
    }
  }
};

export default Toasters;