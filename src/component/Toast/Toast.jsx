import React from "react";
import styles from "./Toast.module.css";

function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type] || ""}`}>
          <span className={styles.message}>{toast.message}</span>
          <div className={styles.actions}>
            {toast.action && (
              <button
                className={styles.actionBtn}
                onClick={() => {
                  toast.action.onClick();
                  onDismiss(toast.id);
                }}
              >
                {toast.action.label}
              </button>
            )}
            <button className={styles.closeBtn} onClick={() => onDismiss(toast.id)}>
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Toast;