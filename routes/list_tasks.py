from flask import Blueprint, jsonify, request, session

from database import get_db_connection

list_tasks_bp = Blueprint("list_tasks", __name__)


@list_tasks_bp.route("/api/tasks", methods=["GET"])
def list_tasks():
    if "user_id" not in session:
        return jsonify({"error": "No autorizado"}), 401

    status_filter = request.args.get("status", "").strip()
    priority_filter = request.args.get("priority", "").strip()

    query = """
        SELECT id, title, description, priority, due_date, status
        FROM tasks
        WHERE user_id = ?
    """
    params = [session["user_id"]]

    if status_filter in ("Pendiente", "Completada"):
        query += " AND status = ?"
        params.append(status_filter)

    if priority_filter in ("Alta", "Media", "Baja"):
        query += " AND priority = ?"
        params.append(priority_filter)

    query += " ORDER BY id DESC"

    conn = get_db_connection()
    rows = conn.execute(query, params).fetchall()
    conn.close()

    tasks = [dict(row) for row in rows]
    return jsonify(tasks), 200
