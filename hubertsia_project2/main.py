from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

data_file = "data.json"


def load_data():
    if not os.path.exists(data_file):
        initial = {"forest": 0, "village": 0}
        with open(data_file, "w") as f:
            json.dump(initial, f, indent=2)
        return initial

    with open(data_file, "r") as f:
        return json.load(f)


def save_data(data):
    with open(data_file, "w") as f:
        json.dump(data, f, indent=2)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/results")
def results():
    data = load_data()
    return render_template("results.html", data=data)


@app.route("/submit_choice", methods=["POST"])
def submit_choice():
    payload = request.get_json()
    if not payload or "choice" not in payload:
        return jsonify(error="Invalid request"), 400

    choice = payload["choice"]
    data = load_data()
    data[choice] = data.get(choice, 0) + 1
    save_data(data)

    return jsonify(success=True, data=data)


@app.route("/get_data", methods=["GET"])
def get_data():
    return jsonify(load_data())

@app.route("/forest")
def forest():
    return render_template("forest.html")


@app.route("/village")
def village():
    return render_template("village.html")


if __name__ == "__main__":
    app.run(debug=True)