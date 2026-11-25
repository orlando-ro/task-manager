from flask import Blueprint, jsonify, session

from database import get_db_connection

delete_task_bp = Blueprint("delete_task", __name__)


@delete_task_bp.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    if "user_id" not in session:
        return jsonify({"error": "No autorizado"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM tasks WHERE id = ? AND user_id = ?",
        (task_id, session["user_id"]),
    )
    deleted = cursor.rowcount
    conn.commit()
    conn.close()

    if deleted == 0:
        return jsonify({"error": "Tarea no encontrada."}), 404

    return jsonify({"message": "Tarea eliminada correctamente.", "id": task_id}), 200
