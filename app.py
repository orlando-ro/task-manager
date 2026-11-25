import os

from flask import Flask, redirect, render_template, session, url_for

from database import init_db
from routes.auth import auth_bp
from routes.create_task import create_task_bp

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key-programacion-3")

init_db()
app.register_blueprint(auth_bp)
app.register_blueprint(create_task_bp)


@app.route("/")
def index():
    if "user_id" not in session:
        return redirect(url_for("auth.login"))
    return render_template("index.html", username=session.get("username"))


if __name__ == "__main__":
    app.run(debug=True)
