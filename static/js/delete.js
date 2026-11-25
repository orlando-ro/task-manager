export function initDeleteTask() {
    document.addEventListener("tasksRendered", (event) => {
        const tasks = event.detail || [];

        tasks.forEach((task) => {
            const actionsEl = document.querySelector(`.task-actions[data-task-id="${task.id}"]`);
            if (!actionsEl) return;

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "btn btn-danger-outline btn-sm";
            deleteBtn.textContent = "Eliminar";
            deleteBtn.addEventListener("click", () => handleDeleteTask(task));

            actionsEl.append(deleteBtn);
        });
    });
}

async function handleDeleteTask(task) {
    const confirmed = window.confirm(`¿Seguro que deseas eliminar la tarea "${task.title}"?`);
    if (!confirmed) return;

    try {
        const response = await fetch(`/api/tasks/${task.id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            document.dispatchEvent(new CustomEvent("tasksUpdated"));
        }
    } catch {
        // error en red, la liste sigue sin cambios
    }
}
