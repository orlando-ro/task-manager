import { initCreateTask } from "./create.js";
import { initListTasks } from "./list.js";

document.addEventListener("DOMContentLoaded", () => {
    initCreateTask();
    initListTasks();
});
