# Import the Flask, OS and datetime library
from flask import Flask, render_template, request, jsonify
import os

# Source code from https://docs.python.org/3/library/datetime.html
from datetime import datetime

# The app
app = Flask(__name__)

# Create a path app for our folder
UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  

# Default route
@app.route("/")
def index():
    return render_template("index.html")


# ==== Starting the Task 3

# 1 - Set up the route
@app.route("/t2")
def t2():
    return render_template("t2.html")

# 2 - Fetch the data of the post
@app.route("/postDataFetch", methods=["POST"])
def postDataFetch():
    
    # 2.1 Attempt to read JSON data sent via fetch()
    data = request.get_json()
    if not data:
        # 2.3 Fallback in case of form or other input types
        data = request.form.to_dict(flat=True)

    # 2.4 Setup file path to data.txt
    file_path = os.path.join("files", "data.txt")
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    

    # 3 - Getting the color for the data, message and timestamp
    color = data.get("color", "n/a")
    message = data.get("message", "no message")
    
    # 4 - For the one we're taking the time data of the year, month, day, hour, minute and second in real-time (depending on the localhost computer)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 5 - Save to file
    with open(file_path, "a", encoding="utf-8") as f:
        f.write(f"{timestamp} | Color: {color} | Message: {message}\n")

    # 6 - Return a JSON response for the browser
    return jsonify(
        {
            "message": " Your data was saved successfully!",
            "received_color": color,
            "received_text": message,
        }
    )


# 7-  Run it
if __name__ == "__main__":
    app.run(debug=True)