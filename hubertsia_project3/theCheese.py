from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import requests
from datetime import datetime
import os

app = Flask(__name__)

# Connect to MongoDB Atlas (replace with your connection string)
client = MongoClient(os.getenv("MONGO_URI"))
db = client["cheese_connect"]
collection = db["submissions"]

CHEESE_API_URL = "https://api.cheese.deepmedchem.com/v1/cheeses"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/add", methods=["POST"])
def add_cheese():
    data = request.json
    cheese_name = data.get("cheese")
    mood = data.get("mood")

    # Optional fetch from cheese API
    cheese_info = None
    try:
        response = requests.get(f"{CHEESE_API_URL}?q={cheese_name}")
        if response.status_code == 200:
            result = response.json()
            if result and isinstance(result, list) and len(result) > 0:
                cheese_data = result[0]
                cheese_info = {
                    "country": cheese_data.get("country"),
                    "milk": cheese_data.get("milk"),
                    "texture": cheese_data.get("texture"),
                }
    except Exception:
        cheese_info = None

    doc = {
        "cheese": cheese_name,
        "mood": mood,
        "info": cheese_info,
        "timestamp": datetime.utcnow().isoformat(),
    }

    collection.insert_one(doc)
    return jsonify({"status": "ok"})

@app.route("/api/all", methods=["GET"])
def get_all():
    all_entries = list(collection.find({}, {"_id": 0}))
    return jsonify(all_entries)

if __name__ == "__main__":
    app.run(debug=True)