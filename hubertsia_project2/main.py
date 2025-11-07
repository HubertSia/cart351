from flask import Flask, render_template, request, jsonify
import json
import os


app = Flask(__name__)



data_file = "data.json"



def load_data():
    """Load story data or initialize if missing"""
    if not os.path.exists(data_file):
        return {"forest": 0, "village": 0}
    with open(data_file, "r") as f:
        return json.load(f)
    



def save_data(data):
    """Save current tally to the JSON file"""
    with open(data_file, "w") as f:
        json.dump(data, f, indent=2)




@app.route("/")
def index():
    """Render main story page"""
    return render_template("index.html")



@app.route("/results")
def results():
    """Render current collective data view"""
    data = load_data()
    return render_template("results.html", data=data)



@app.route("/sumbit_choice", methods=["Post"])
def sumbit_choice():
    """Receive a user's choice and update the JSON file"""
    payload = request.get_json()
    choice = payload.get("choice")

    data = load_data()
    if choice not in data:
        data[choice] = 0
    data[choice] += 1

    save_data(data)
    return jsonify(success=True, data=data)


@app.route("/get_data", methods=["Get"])
def get_data():
    """Send current collective data back to frontend as JSON."""
    data = load_data()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)