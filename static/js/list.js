export function initListTasks() {
    const statusSelect = document.getElementById("filter-status");
    const prioritySelect = document.getElementById("filter-priority");

    const reload = () =>
        loadTasks({
            status: statusSelect ? statusSelect.value : "",
            priority: prioritySelect ? prioritySelect.value : "",
        });

    if (statusSelect) {
        statusSelect.addEventListener("change", reload);
    }

    if (prioritySelect) {
        prioritySelect.addEventListener("change", reload);
    }

    document.addEventListener("taskCreated", reload);
    document.addEventListener("tasksUpdated", reload);

    reload();
}

export async function loadTasks({ status = "", priority = "" } = {}) {
    const container = document.getElementById("task-list");
    const countElement = document.getElementById("task-count");

    if (!container) return;

    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (priority) params.append("priority", priority);

    const queryString = params.toString();
    const url = queryString ? `/api/tasks?${queryString}` : "/api/tasks";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            container.innerHTML = `<p class="empty-state">No se pudieron cargar las tareas.</p>`;
            return;
        }

        const tasks = await response.json();

        if (countElement) {
            countElement.textContent = `(${tasks.length})`;
        }

        if (tasks.length === 0) {
            container.innerHTML = `<p class="empty-state">No hay tareas para mostrar.</p>`;
            return;
        }

        container.innerHTML = tasks.map(renderTaskCard).join("");
    } catch {
        container.innerHTML = `<p class="empty-state">Error de conexión al cargar las tareas.</p>`;
    }
}

function renderTaskCard(task) {
    const priorityClass = `badge-${task.priority.toLowerCase()}`;
    const completedClass = task.status === "Completada" ? "task-completed" : "";
    const dueDateHtml = task.due_date
        ? `<span class="task-date">Vence: ${escapeHtml(task.due_date)}</span>`
        : "";
    const descriptionHtml = task.description
        ? `<p class="task-desc">${escapeHtml(task.description)}</p>`
        : "";

    return `
        <article class="task-item ${completedClass}" data-task-id="${task.id}">
            <div class="task-body">
                <div class="task-title-row">
                    <h3>${escapeHtml(task.title)}</h3>
                    <span class="badge ${priorityClass}">${escapeHtml(task.priority)}</span>
                    <span class="badge badge-status">${escapeHtml(task.status)}</span>
                </div>
                ${descriptionHtml}
                <div class="task-meta">
                    ${dueDateHtml}
                </div>
            </div>
            <div class="task-actions" data-task-id="${task.id}"></div>
        </article>
    `;
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
