import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_CATEGORIES } from "../constants/taskCategories";

// دسته‌های پیش‌فرض + دسته‌های سفارشی کاربر که در localStorage ذخیره می‌شن
export function useCategories() {
  const [customCategories, setCustomCategories] = useLocalStorage(
    "taskManager_customCategories",
    [],
  );

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];
  const selectableCategories = allCategories.filter((c) => c.value !== "all");

  const addCategory = (title, color, icon) => {
    const value = `${title.trim().toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;
    const newCategory = {
      id: Date.now(),
      title: title.trim(),
      value,
      describe: title.trim(),
      color,
      icon: icon?.trim() || "🏷️",
    };
    setCustomCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const removeCategory = (value) => {
    setCustomCategories((prev) => prev.filter((c) => c.value !== value));
  };

  return { allCategories, selectableCategories, addCategory, removeCategory };
}