export const DEFAULT_CATEGORIES = [
  { id: 0, title: "همه", value: "all", describe: "همه", color: null, icon: "📋" },
  { id: 1, title: "جدید ترین", value: "newest", describe: "جدید ترین ها", color: "#ff5e00", icon: "🆕" },
  { id: 2, title: "اجباری", value: "forced", describe: "اجباری ها", color: "#ff0095", icon: "⚡" },
  { id: 3, title: "اختیاری", value: "relax", describe: "آروم باش", color: "#00abdf", icon: "🌙" },
  { id: 4, title: "بحرانی", value: "important", describe: "اوضاع بده", color: "#e11d48", icon: "🔥" },
];

export const getCategoryColor = (typeValue, categories = DEFAULT_CATEGORIES) => {
  const category = categories.find((c) => c.value === typeValue);
  return category?.color
    ? { backgroundColor: category.color, color: "white" }
    : { backgroundColor: "#e7c70e", color: "white" };
};

export const getCategoryTitle = (typeValue, categories = DEFAULT_CATEGORIES) => {
  const category = categories.find((c) => c.value === typeValue);
  return category ? category.title : typeValue;
};