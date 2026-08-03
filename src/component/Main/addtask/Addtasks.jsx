import React, { useState, useRef } from "react";
import Styles from "./Addtask.module.css";
import hourglass from "../../../assets/hourglass.png";
import Addbox from "./Addbox";

function Addtasks({
  onAddTask,
  onFilterChange,
  filterValue,
  isDark,
  onToggleDarkMode,
  totalTasks,
  doneTasks,
  categories,
  selectableCategories,
  onAddCategory,
  categoryStats,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onMarkAllComplete,
  onDeleteAllCompleted,
  onExport,
  onImport,
}) {
  const [addingbox, setaddingbox] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatTitle, setNewCatTitle] = useState("");
  const [newCatColor, setNewCatColor] = useState("#8c6a1f");
  const [newCatIcon, setNewCatIcon] = useState("🏷️");
  const fileInputRef = useRef(null);

  const wantadd = () => setaddingbox(true);
  const closebox = () => setaddingbox(false);
  const handleFilterChange = (e) => onFilterChange(e.target.value);
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const handleAddCategory = () => {
    if (!newCatTitle.trim()) return;
    onAddCategory(newCatTitle, newCatColor, newCatIcon);
    setNewCatTitle("");
    setShowNewCategory(false);
  };

  const handleImportClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onImport(file);
    e.target.value = "";
  };

  return (
    <>
      <div className={Styles.addtasks}>
        <div>
          <div className={Styles.managementpart}>
            <img src={hourglass} className={Styles.hour} alt="" />
            <h2 className={Styles.managementtopic}>مدیریت و برنامه ریزی</h2>
            <button
              className={Styles.darkModeBtn}
              onClick={onToggleDarkMode}
              title={isDark ? "حالت روشن" : "حالت تاریک"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
          <h3 className={Styles.creator}>ساخته شده توسط علی اسمعیلی</h3>

          {totalTasks > 0 && (
            <div className={Styles.progressWrap}>
              <div className={Styles.progressBar}>
                <div className={Styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <span className={Styles.progressText}>
                {doneTasks} از {totalTasks} تسک انجام شده ({progress}٪)
              </span>
            </div>
          )}

          {categoryStats?.length > 0 && totalTasks > 0 && (
            <div className={Styles.statsRow}>
              {categoryStats.map((cat) => (
                <div key={cat.value} className={Styles.statItem}>
                  <span className={Styles.statIcon}>{cat.icon}</span>
                  <div className={Styles.statBarTrack}>
                    <div
                      className={Styles.statBarFill}
                      style={{
                        width: totalTasks ? `${(cat.count / totalTasks) * 100}%` : "0%",
                        backgroundColor: cat.color || "#e7c70e",
                      }}
                    />
                  </div>
                  <span className={Styles.statCount}>{cat.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={Styles.controlsRow}>
          <button className={Styles.button} onClick={wantadd}>
            ایجاد جدید+
          </button>
          <select value={filterValue} onChange={handleFilterChange} className={Styles.shoeselection}>
            {categories.map((item) => (
              <option key={item.id} value={item.value}>
                {item.icon} {item.title}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={Styles.shoeselection}
          >
            <option value="manual">ترتیب دستی</option>
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="az">الفبایی</option>
            <option value="deadline">نزدیک‌ترین سررسید</option>
          </select>
        </div>

        <input
          type="text"
          className={Styles.searchInput}
          placeholder="🔍 جستجو در تسک‌ها..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <div className={Styles.controlsRow}>
          <button className={Styles.smallBtn} onClick={onMarkAllComplete}>
            ✓ همه رو تکمیل کن
          </button>
          <button className={Styles.smallBtn} onClick={onDeleteAllCompleted}>
            🗑️ حذف تکمیل‌شده‌ها
          </button>
          <button className={Styles.smallBtn} onClick={onExport}>
            ⬇️ خروجی JSON
          </button>
          <button className={Styles.smallBtn} onClick={handleImportClick}>
            ⬆️ وارد کردن
          </button>
          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button className={Styles.smallBtn} onClick={() => setShowNewCategory((s) => !s)}>
            🏷️ دسته جدید
          </button>
        </div>

        {showNewCategory && (
          <div className={Styles.newCategoryRow}>
            <input
              type="text"
              className={Styles.inputtask}
              placeholder="نام دسته..."
              value={newCatTitle}
              onChange={(e) => setNewCatTitle(e.target.value)}
            />
            <input
              type="color"
              value={newCatColor}
              onChange={(e) => setNewCatColor(e.target.value)}
              className={Styles.colorPicker}
            />
            <input
              type="text"
              className={Styles.iconInput}
              placeholder="🏷️"
              value={newCatIcon}
              maxLength={2}
              onChange={(e) => setNewCatIcon(e.target.value)}
            />
            <button className={Styles.submitbtn} onClick={handleAddCategory}>
              افزودن
            </button>
          </div>
        )}
      </div>

      {addingbox && (
        <>
          <div className={Styles.overlay} onClick={closebox} />
          <Addbox closebox={closebox} onAddTask={onAddTask} categories={selectableCategories} />
        </>
      )}
    </>
  );
}

export default Addtasks;