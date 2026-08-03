import { useState, useCallback, useRef } from "react";

let idCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showToast = useCallback(
    (message, type = "info", action = null, duration = 4000) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type, action }]);
      timers.current[id] = setTimeout(() => removeToast(id), duration);
      return id;
    },
    [removeToast],
  );

  return { toasts, showToast, removeToast };
}