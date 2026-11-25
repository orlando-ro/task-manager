from flask import Blueprint, jsonify, request, session

from database import get_db_connection

update_task_bp = Blueprint("update_task", __name__)


@update_task_bp.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    if "user_id" not in session:
        return jsonify({"error": "No autorizado"}), 401

    conn = get_db_connection()
    task = conn.execute(
        "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
        (task_id, session["user_id"]),
    ).fetchone()

    if not task:
        conn.close()
        return jsonify({"error": "Tarea no encontrada."}), 404

    data = request.get_json(silent=True) or {}

    title = data.get("title", task["title"]).strip()
    description = data.get("description", task["description"] or "").strip()
    priority = data.get("priority", task["priority"])
    due_date = data.get("due_date", task["due_date"] or "").strip()
    status = data.get("status", task["status"])

    if not title:
        conn.close()
        return jsonify({"error": "El título es obligatorio."}), 400

    if priority not in ("Alta", "Media", "Baja"):
        conn.close()
        return jsonify({"error": "Prioridad no válida."}), 400

    if status not in ("Pendiente", "Completada"):
        conn.close()
        return jsonify({"error": "Estado no válido."}), 400

    conn.execute(
        """
        UPDATE tasks
        SET title = ?, description = ?, priority = ?, due_date = ?, status = ?
        WHERE id = ? AND user_id = ?
        """,
        (title, description, priority, due_date, status, task_id, session["user_id"]),
    )
    conn.commit()
    conn.close()

    return jsonify(
        {
            "id": task_id,
            "title": title,
            "description": description,
            "priority": priority,
            "due_date": due_date,
            "status": status,
        }
    ), 200
