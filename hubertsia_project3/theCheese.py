from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Flask + SocketIO setup
app = Flask(__name__)
app.config["SECRET_KEY"] = "super_secret_key"
socketio = SocketIO(app, cors_allowed_origins="*")

# MongoDB connection
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["cheese_connect"]
collection = db["submissions"]

users = {}

# ---------------- ROUTES ----------------
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/all", methods=["GET"])
def get_all():
    all_entries = list(collection.find({}, {"_id": 0}))
    return jsonify(all_entries)


# ---------------- SOCKET EVENTS ----------------
@socketio.on("connect")
def connect_user():
    app.logger.info(f"{request.sid} connected")


@socketio.on("join")
def handle_join(username):
    users[request.sid] = username
    app.logger.info(f"{username} joined (sid: {request.sid})")
    emit("join-complete", f"{username} joined Cheese Connect")


@socketio.on("newCheese")
def handle_new_cheese(data):
    cheese = data.get("cheese")
    mood = data.get("mood")
    if not cheese or not mood:
        return

    doc = {
        "cheese": cheese,
        "mood": mood,
        "timestamp": datetime.utcnow().isoformat(),
    }
    collection.insert_one(doc)

    # broadcast to everyone including sender
    emit("cheeseFromServer", doc, broadcast=True)


@socketio.on("disconnect")
def handle_disconnect():
    if request.sid in users:
        app.logger.info(f"{users[request.sid]} disconnected")
        users.pop(request.sid, None)
    else:
        app.logger.info(f"{request.sid} disconnected (no username)")


# ---------------- DRIVER ----------------
if __name__ == "__main__":
    socketio.run(app, debug=True)