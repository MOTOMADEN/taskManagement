import { useState, useEffect, useRef } from "react";
import "./App.css";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useDarkMode } from "./hooks/useDarkMode";
import { useToast } from "./hooks/useToast";
import { useCategories } from "./hooks/useCategories";
import Addtasks from "./component/Main/addtask/Addtasks";
import Inprogres from "./component/Main/inprogrestasks/Inprogres";
import Toast from "./component/Toast/Toast";
import Confetti from "./component/Confetti/Confetti";

function App() {
  const [allTasks, setAllTasks] = useLocalStorage("taskManager_tasks", []);
  const [filterValue, setFilterValue] = useLocalStorage("taskManager_filter", "all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useLocalStorage("taskManager_sort", "manual");
  const [isDark, setIsDark] = useDarkMode();
  const [showConfetti, setShowConfetti] = useState(false);

  const { toasts, showToast, removeToast } = useToast();
  const { allCategories, selectableCategories, addCategory } = useCategories();
  const wasAllDone = useRef(false);

  // وقتی همه‌ی تسک‌ها تکمیل بشن، جشن کوچیک بگیر
  useEffect(() => {
    const allDone = allTasks.length > 0 && allTasks.every((t) => t.isdone);
    if (allDone && !wasAllDone.current) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3200);
    }
    wasAllDone.current = allDone;
  }, [allTasks]);

  const handleNewTask = (taskData) => {
    setAllTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        typeValue: taskData.typeValue,
        typeTitle: taskData.typeTitle,
        value: taskData.value,
        description: taskData.description,
        deadline: taskData.deadline || null,
        isdone: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    showToast("تسک با موفقیت اضافه شد", "success");
  };

  const handleEditTask = (taskId, taskData) => {
    setAllTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...taskData } : task)),
    );
    showToast("تسک ویرایش شد", "success");
  };

  // حذف با ۵ ثانیه فرصت بازگردانی، بدون window.confirm آزاردهنده
  const deleteTask = (taskId) => {
    const taskToDelete = allTasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;

    setAllTasks((prev) => prev.filter((task) => task.id !== taskId));

    showToast(
      "تسک حذف شد",
      "info",
      {
        label: "بازگردانی",
        onClick: () => setAllTasks((prev) => [...prev, taskToDelete]),
      },
      5000,
    );
  };

  const handleFilterChange = (value) => setFilterValue(value);

  const toggleTaskStatus = (taskId) => {
    setAllTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, isdone: !task.isdone } : task)),
    );
  };

  const reorderTasks = (draggedId, targetId) => {
    setAllTasks((prev) => {
      const list = [...prev];
      const draggedIndex = list.findIndex((t) => t.id === draggedId);
      const targetIndex = list.findIndex((t) => t.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      const [dragged] = list.splice(draggedIndex, 1);
      list.splice(targetIndex, 0, dragged);
      return list;
    });
  };

  const markAllComplete = () => {
    setAllTasks((prev) => prev.map((t) => ({ ...t, isdone: true })));
    showToast("همه‌ی تسک‌ها تکمیل شدند", "success");
  };

  const deleteAllCompleted = () => {
    const completedCount = allTasks.filter((t) => t.isdone).length;
    if (completedCount === 0) return;
    if (!window.confirm(`آیا از حذف ${completedCount} تسک تکمیل‌شده مطمئن هستید؟`)) return;
    setAllTasks((prev) => prev.filter((t) => !t.isdone));
    showToast(`${completedCount} تسک حذف شد`, "info");
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(allTasks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("فایل پشتیبان دانلود شد", "success");
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported)) throw new Error("invalid format");
        const withNewIds = imported.map((t) => ({ ...t, id: Date.now() + Math.random() }));
        setAllTasks((prev) => [...prev, ...withNewIds]);
        showToast(`${withNewIds.length} تسک وارد شد`, "success");
      } catch {
        showToast("فایل نامعتبر است", "error");
      }
    };
    reader.readAsText(file);
  };

  // فیلتر + جستجو + مرتب‌سازی
  let visibleTasks =
    filterValue === "all" ? allTasks : allTasks.filter((t) => t.typeValue === filterValue);

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    visibleTasks = visibleTasks.filter(
      (t) => t.value.toLowerCase().includes(term) || t.description?.toLowerCase().includes(term),
    );
  }

  if (sortBy === "newest") {
    visibleTasks = [...visibleTasks].sort((a, b) => b.id - a.id);
  } else if (sortBy === "oldest") {
    visibleTasks = [...visibleTasks].sort((a, b) => a.id - b.id);
  } else if (sortBy === "az") {
    visibleTasks = [...visibleTasks].sort((a, b) => a.value.localeCompare(b.value, "fa"));
  } else if (sortBy === "deadline") {
    visibleTasks = [...visibleTasks].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }

  const doneCount = allTasks.filter((t) => t.isdone).length;

  const categoryStats = selectableCategories.map((cat) => ({
    ...cat,
    count: allTasks.filter((t) => t.typeValue === cat.value).length,
  }));

  return (
    <div>
      <Addtasks
        onAddTask={handleNewTask}
        onFilterChange={handleFilterChange}
        filterValue={filterValue}
        isDark={isDark}
        onToggleDarkMode={() => setIsDark((d) => !d)}
        totalTasks={allTasks.length}
        doneTasks={doneCount}
        categories={allCategories}
        selectableCategories={selectableCategories}
        onAddCategory={addCategory}
        categoryStats={categoryStats}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onMarkAllComplete={markAllComplete}
        onDeleteAllCompleted={deleteAllCompleted}
        onExport={handleExport}
        onImport={handleImport}
      />
      <Inprogres
        tasks={visibleTasks}
        onToggleTask={toggleTaskStatus}
        onDelete={deleteTask}
        onEditTask={handleEditTask}
        onReorder={reorderTasks}
        canReorder={sortBy === "manual"}
        categories={allCategories}
        selectableCategories={selectableCategories}
      />
      <Toast toasts={toasts} onDismiss={removeToast} />
      <Confetti show={showConfetti} />
    </div>
  );
}

export default App;