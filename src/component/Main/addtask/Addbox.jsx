import React, { useState, useEffect, useCallback } from "react";
import Styles from "./Addtask.module.css";

function Addbox({ onAddTask, onEditTask, closebox, initialData, editingTaskId, categories }) {
  const isEditMode = Boolean(editingTaskId);

  const [tasktype, settasktype] = useState(initialData?.typeValue || "");
  const [taskvalue, settaskvalue] = useState(initialData?.value || "");
  const [describetask, setdescribetask] = useState(initialData?.description || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");

  const handleSubmit = useCallback(() => {
    if (!tasktype || !taskvalue.trim()) {
      alert("لطفاً نوع و عنوان تسک را وارد کنید");
      return;
    }
    const selectedType = categories.find((item) => item.value === tasktype);
    const taskTitle = selectedType ? selectedType.title : tasktype;

    const taskData = {
      typeValue: tasktype,
      typeTitle: taskTitle,
      value: taskvalue.trim(),
      description: describetask.trim(),
      deadline: deadline || null,
    };

    if (isEditMode) {
      onEditTask(editingTaskId, taskData);
    } else {
      onAddTask(taskData);
    }
    closebox();
  }, [tasktype, taskvalue, describetask, deadline, isEditMode, categories, editingTaskId, onAddTask, onEditTask, closebox]);

  // میانبر کیبورد: Esc برای بستن، Enter برای ثبت
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closebox();
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") handleSubmit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closebox, handleSubmit]);

  return (
    <div className={Styles.Addbox}>
      <button className={Styles.cancelbtn} onClick={closebox}>
        X
      </button>
      <div className={Styles.midofadding}>
        <h2>{isEditMode ? "ویرایش تسک" : "افزودن تسک جدید"}</h2>
        <div className={Styles.inputbox}>
          <div className={Styles.inputpart}>
            <select
              className={Styles.shoeselection}
              onChange={(e) => settasktype(e.target.value)}
              value={tasktype}
            >
              <option value="" disabled hidden>
                نوع تسک
              </option>
              {categories.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.icon} {item.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              className={Styles.inputtask}
              placeholder="عنوان تسک..."
              value={taskvalue}
              onChange={(e) => settaskvalue(e.target.value)}
              autoFocus
            />
          </div>
          <input
            type="text"
            className={Styles.inputtask}
            placeholder="توضیحات..."
            value={describetask}
            onChange={(e) => setdescribetask(e.target.value)}
          />
          <div className={Styles.deadlineRow}>
            <label className={Styles.deadlineLabel}>سررسید (اختیاری):</label>
            <input
              type="date"
              className={Styles.dateInput}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button className={Styles.submitbtn} onClick={handleSubmit}>
        {isEditMode ? "ذخیره تغییرات" : "ثبت"}
      </button>
    </div>
  );
}

export default Addbox;