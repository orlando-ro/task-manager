import { initCreateTask } from "./create.js";
import { initDeleteTask } from "./delete.js";
import { initListTasks } from "./list.js";
import { initUpdateTask } from "./update.js";

document.addEventListener("DOMContentLoaded", () => {
    initCreateTask();
    initUpdateTask();
    initDeleteTask();
    initListTasks();
});
