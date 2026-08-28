"use client";

import { useState, useEffect, ReactNode } from "react";
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastNotificationProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: { icon: <CheckCircle size={15} />, bg: "#EAF7EE", text: "#138808", border: "#138808" },
    warning: { icon: <AlertTriangle size={15} />, bg: "#FFF7E8", text: "#B45309", border: "#F59E0B" },
    error: { icon: <XCircle size={15} />, bg: "#FFF1F1", text: "#DC2626", border: "#EF4444" },
    info: { icon: <Info size={15} />, bg: "#EBF5FF", text: "#1D4ED8", border: "#3B82F6" },
  }[toast.type];

  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-slide-in-right max-w-xs"
      style={{ backgroundColor: config.bg, color: config.text, borderColor: config.border + "60" }}
    >
      <span aria-hidden="true" className="flex-shrink-0 mt-0.5">{config.icon}</span>
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="flex-shrink-0 hover:opacity-60 transition-opacity"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export default function ToastNotification({ toasts, onDismiss }: ToastNotificationProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, dismissToast };
}
