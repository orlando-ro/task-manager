export function initUpdateTask() {
    const modal = document.getElementById("edit-modal");
    const form = document.getElementById("edit-task-form");
    const closeBtn = document.getElementById("close-edit-modal");
    const cancelBtn = document.getElementById("cancel-edit-btn");
    const feedback = document.getElementById("edit-feedback");

    if (!modal || !form) return;

    const tasksMap = new Map();

    const closeModal = () => {
        modal.classList.add("hidden");
        if (feedback) feedback.classList.add("hidden");
    };

    const openModal = (task) => {
        form.id.value = task.id;
        form.title.value = task.title;
        form.description.value = task.description || "";
        form.priority.value = task.priority;
        form.status.value = task.status;
        form.due_date.value = task.due_date || "";
        modal.classList.remove("hidden");
    };

    document.addEventListener("tasksRendered", (event) => {
        const tasks = event.detail || [];
        tasksMap.clear();

        tasks.forEach((task) => {
            tasksMap.set(task.id, task);
            const actionsEl = document.querySelector(`.task-actions[data-task-id="${task.id}"]`);
            if (!actionsEl) return;

            const toggleBtn = document.createElement("button");
            toggleBtn.type = "button";
            toggleBtn.className = "btn btn-outline btn-sm";
            toggleBtn.textContent = task.status === "Completada" ? "Reabrir" : "Completar";
            toggleBtn.addEventListener("click", () => toggleTaskStatus(task));

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.className = "btn btn-outline btn-sm";
            editBtn.textContent = "Editar";
            editBtn.addEventListener("click", () => openModal(tasksMap.get(task.id)));

            actionsEl.append(toggleBtn, editBtn);
        });
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const taskId = form.id.value;
        const payload = {
            title: form.title.value.trim(),
            description: form.description.value.trim(),
            priority: form.priority.value,
            status: form.status.value,
            due_date: form.due_date.value,
        };

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                if (feedback) {
                    feedback.textContent = data.error || "Error al actualizar la tarea.";
                    feedback.className = "feedback alert-error";
                }
                return;
            }

            closeModal();
            document.dispatchEvent(new CustomEvent("tasksUpdated"));
        } catch {
            if (feedback) {
                feedback.textContent = "Error de conexión con el servidor.";
                feedback.className = "feedback alert-error";
            }
        }
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
}

async function toggleTaskStatus(task) {
    const nextStatus = task.status === "Completada" ? "Pendiente" : "Completada";

    try {
        const response = await fetch(`/api/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: nextStatus }),
        });

        if (response.ok) {
            document.dispatchEvent(new CustomEvent("tasksUpdated"));
        }
    } catch {
        // error silencioso, el estado se mantiene
    }
}
