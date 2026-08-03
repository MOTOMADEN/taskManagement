import { useState, useEffect } from "react";

// این هوک دقیقاً مثل useState کار می‌کنه، با این تفاوت که مقدارش
// به‌صورت خودکار توی localStorage ذخیره می‌شه و با رفرش صفحه از بین نمی‌ره.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.error(`خطا در خواندن "${key}" از localStorage:`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`خطا در ذخیره‌ی "${key}" در localStorage:`, err);
    }
  }, [key, value]);

  return [value, setValue];
}
