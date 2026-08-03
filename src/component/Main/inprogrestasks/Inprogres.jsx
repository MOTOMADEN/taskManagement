import React, { useState } from "react";
import styles from "./Inprogres.module.css";
import Addbox from "../addtask/Addbox";
import { getCategoryColor } from "../../../constants/taskCategories";

function getDeadlineInfo(deadline) {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadline);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due - today) / 86400000);

  if (diffDays < 0) return { text: `${Math.abs(diffDays)} روز دیرکرد`, type: "overdue" };
  if (diffDays === 0) return { text: "امروز", type: "today" };
  if (diffDays === 1) return { text: "فردا", type: "soon" };
  return { text: `${diffDays} روز مانده`, type: "later" };
}

function Inprogres({
  tasks,
  onToggleTask,
  onDelete,
  onEditTask,
  onReorder,
  canReorder,
  categories,
  selectableCategories,
}) {
  const [editingTask, setEditingTask] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

  const activeTasks = tasks.filter((task) => !task.isdone);
  const completedTasks = tasks.filter((task) => task.isdone);

  const handleEditClick = (task) => setEditingTask(task);
  const closeEditBox = () => setEditingTask(null);

  const handleDragStart = (taskId) => canReorder && setDraggedId(taskId);
  const handleDragOver = (e) => canReorder && e.preventDefault();
  const handleDrop = (targetId) => {
    if (canReorder && draggedId && draggedId !== targetId) {
      onReorder(draggedId, targetId);
    }
    setDraggedId(null);
  };

  const renderTaskCard = (task) => {
    const deadlineInfo = getDeadlineInfo(task.deadline);

    return (
      <div
        key={task.id}
        className={`${styles.inprogrestasks} ${task.isdone ? styles.doneCard : ""}`}
        draggable={canReorder}
        onDragStart={() => handleDragStart(task.id)}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(task.id)}
      >
        {canReorder && <span className={styles.dragHandle}>⠿</span>}
        <div className={styles.inprogresdetails}>
          <h2 className={`${styles.inprogresname} ${task.isdone ? styles.strikethrough : ""}`}>
            {task.value}
          </h2>
          <h3 className={styles.inprogresdiscription}>{task.description}</h3>
          {deadlineInfo && (
            <span className={`${styles.deadlineBadge} ${styles[deadlineInfo.type]}`}>
              📅 {deadlineInfo.text}
            </span>
          )}
        </div>
        <div className={styles.inprogresbtns}>
          <div className={styles.inprogresrightprt}>
            <button className={styles.done} onClick={() => onToggleTask(task.id)}>
              {task.isdone ? "تکمیل شده ✓" : "تکمیل شد"}
            </button>
            <button className={styles.important} style={getCategoryColor(task.typeValue, categories)}>
              {task.typeTitle}
            </button>
          </div>
          <div className={styles.inprogresleftpart}>
            <button className={styles.edit} onClick={() => handleEditClick(task)}>
              🖊️
            </button>
            <button className={styles.delet} onClick={() => onDelete(task.id)}>
              X
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.inprogres}>
      {editingTask && <div className={styles.overlay} onClick={closeEditBox} />}

      <h3 className={styles.inprogrestxt}>تسک های در حال انجام : ({activeTasks.length})</h3>
      <div className={styles.inprogrescard}>
        {activeTasks.length > 0 ? (
          activeTasks.map(renderTaskCard)
        ) : (
          <div className={styles.empty}>
            <p>هیچ تسکی وجود ندارد</p>
            <p>برای افزودن تسک جدید، روی دکمه "ایجاد جدید+" کلیک کنید</p>
          </div>
        )}
      </div>

      <h3 className={styles.inprogrestxt}>تسک های تکمیل شده : ({completedTasks.length})</h3>
      <div className={styles.inprogrescard}>
        {completedTasks.length > 0 ? (
          completedTasks.map(renderTaskCard)
        ) : (
          <div className={styles.empty}>
            <p>هیچ تسکی وجود ندارد</p>
          </div>
        )}
      </div>

      {editingTask && (
        <Addbox
          closebox={closeEditBox}
          onEditTask={onEditTask}
          initialData={editingTask}
          editingTaskId={editingTask.id}
          categories={selectableCategories}
        />
      )}
    </div>
  );
}

export default Inprogres;