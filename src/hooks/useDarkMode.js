import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

// حالت تاریک/روشن رو مدیریت می‌کنه و ترجیح کاربر رو ذخیره می‌کنه.
// با گذاشتن data-theme روی <html>، همه‌ی CSS variable ها توی App.css
// به‌صورت خودکار عوض می‌شن، بدون نیاز به تغییر توی هر کامپوننت.
export function useDarkMode() {
  const [isDark, setIsDark] = useLocalStorage("darkMode", false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return [isDark, setIsDark];
}
