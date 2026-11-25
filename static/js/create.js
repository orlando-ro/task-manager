export function initCreateTask() {
    const form = document.getElementById("create-task-form");
    const feedback = document.getElementById("create-feedback");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const payload = {
            title: form.title.value.trim(),
            description: form.description.value.trim(),
            priority: form.priority.value,
            due_date: form.due_date.value,
        };

        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                showFeedback(feedback, data.error || "Error al crear la tarea.", true);
                return;
            }

            form.reset();
            showFeedback(feedback, `Tarea "${data.title}" creada correctamente.`, false);
            document.dispatchEvent(new CustomEvent("taskCreated", { detail: data }));
        } catch {
            showFeedback(feedback, "Error de conexión con el servidor.", true);
        }
    });
}

function showFeedback(element, message, isError) {
    if (!element) return;
    element.textContent = message;
    element.className = `feedback ${isError ? "alert-error" : "alert-success"}`;
    setTimeout(() => {
        element.classList.add("hidden");
    }, 3000);
}
