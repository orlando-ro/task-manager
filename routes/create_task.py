from flask import Blueprint, jsonify, request, session

from database import get_db_connection

create_task_bp = Blueprint("create_task", __name__)


@create_task_bp.route("/api/tasks", methods=["POST"])
def create_task():
    if "user_id" not in session:
        return jsonify({"error": "No autorizado"}), 401

    data = request.get_json(silent=True) or {}
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    priority = data.get("priority", "Media")
    due_date = data.get("due_date", "").strip()

    if not title:
        return jsonify({"error": "El título es obligatorio."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO tasks (user_id, title, description, priority, due_date)
        VALUES (?, ?, ?, ?, ?)
        """,
        (session["user_id"], title, description, priority, due_date),
    )
    task_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify(
        {
            "id": task_id,
            "title": title,
            "description": description,
            "priority": priority,
            "due_date": due_date,
            "status": "Pendiente",
        }
    ), 201
