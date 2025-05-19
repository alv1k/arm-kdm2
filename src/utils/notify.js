import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Настройки по умолчанию (можно переопределять)
const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
};

export const showToast = (message, type = 'default', options = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };

  switch (type) {
    case 'success':
      toast.success(message, mergedOptions);
      break;
    case 'error':
      toast.error(message, mergedOptions);
      break;
    case 'warning':
      toast.warn(message, mergedOptions);
      break;
    case 'info':
      toast.info(message, mergedOptions);
      break;
    default:
      toast(message, mergedOptions);
  }
};