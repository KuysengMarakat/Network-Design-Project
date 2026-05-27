import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const api = {
    show,
    success: (msg) => show(msg, "success"),
    error:   (msg) => show(msg, "error"),
    info:    (msg) => show(msg, "info"),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const styles = {
    success: { Icon: CheckCircle2, bg: "bg-khmer-green-500", text: "text-white" },
    error:   { Icon: XCircle,      bg: "bg-clay-500",        text: "text-white" },
    info:    { Icon: Info,         bg: "bg-brown-700",       text: "text-white" },
  }[toast.type] || { Icon: Info, bg: "bg-brown-700", text: "text-white" };

  const { Icon } = styles;

  return (
    <div className={`${styles.bg} ${styles.text} px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 min-w-[280px] animate-slide-up`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button onClick={onDismiss} className="opacity-70 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
