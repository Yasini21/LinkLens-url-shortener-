import { createContext, useContext, useState, useMemo } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(window.toastTimeout);
    window.toastTimeout = window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className={`toast-toast ${toast.type}`}>
          <p>{toast.message}</p>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider");
  }
  return context;
};