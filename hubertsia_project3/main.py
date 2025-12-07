from flask import Flask, render_template, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from datetime import datetime
from dotenv import load_dotenv
import os
from bson import ObjectId

# Make sure the following library install are download: pip install flask flask-pymongo flask-cors flask-socketio python-dotenv

# Load environment variables from .env
load_dotenv()

# Initialize Flask
app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

# --- MongoDB Connection ---
MONGO_USER = os.getenv("MONGODB_USER")
MONGO_PASS = os.getenv("DATABASE_PASSWORD")
MONGO_DB = os.getenv("DATABASE_NAME")

MONGO_URI = (
    f"mongodb+srv://{MONGO_USER}:{MONGO_PASS}"
    f"@cluster0.qzy0zng.mongodb.net/{MONGO_DB}"
    f"?retryWrites=true&w=majority&appName=Cluster0"
)

app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)

# --- Initialize Socket.IO ---
socketio = SocketIO(app, cors_allowed_origins="*")


# Helper — make MongoDB documents JSON-friendly
def serialize_mongo(doc):
    """Convert ObjectId and other BSON types to JSON-serializable forms."""
    if isinstance(doc, list):
        return [serialize_mongo(d) for d in doc]
    if isinstance(doc, dict):
        return {k: serialize_mongo(v) for k, v in doc.items()}
    if isinstance(doc, ObjectId):
        return str(doc)
    return doc


@app.route("/")
def index():
    """Serve the main page."""
    return render_template("index.html")


@socketio.on("connect")
def handle_connect():
    """When a client connects, send them all saved moods."""
    app.logger.info(f"Client connected: {request.sid}")

    # Load saved moods from MongoDB
    moods = list(mongo.db.moods.find())
    moods = serialize_mongo(moods)

    emit("init-moods", moods)
    emit("connect-confirm", {"status": "connected"})


@socketio.on("submit-mood")
def handle_new_mood(data):
    """Receive new mood, save to DB, and broadcast to everyone."""
    data["timestamp"] = datetime.utcnow().isoformat()

    # Insert into MongoDB
    result = mongo.db.moods.insert_one(data)
    data["_id"] = str(result.inserted_id)

    # Broadcast to everyone (including sender)
    emit("new-mood", data, broadcast=True)
    app.logger.info(f"Broadcast new mood: {data}")


@socketio.on("disconnect")
def handle_disconnect():
    """Handle client disconnect."""
    app.logger.info(f"Client {request.sid} disconnected.")


# --- Run the server ---
if __name__ == "__main__":
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)