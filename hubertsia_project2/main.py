# Importing the Flask library
from flask import Flask, render_template, request, jsonify

# import the JSON
import json

# Import the OS library
import os

app = Flask(__name__)

# Load the JSON file
data_file = "data.json"


def load_data():
    # Load story data or create it if missing on the JSON file.
    if not os.path.exists(data_file):
        initial = {
            "forest": 0,
            "village": 0,
            "investigate": 0,
            "tame_wolf": 0,
            "scare_wolf": 0,
            "tavern": 0,
            "walkaway": 0,
            "throw": 0,
            "talk": 0,
        }
        with open(data_file, "w") as f:
            json.dump(initial, f, indent=2)
        return initial
    
    # Create said results on the json file and load them in the html later
    with open(data_file, "r") as f:
        data = json.load(f)

    default_keys = [
        "forest",
        "village",
        "investigate",
        "tame_wolf",
        "scare_wolf",
        "tavern",
        "walkaway",
        "throw",
        "talk",
    ]
    for key in default_keys:
        data.setdefault(key, 0)
    save_data(data)
    return data

# Save story data to the JSON file.
def save_data(data):
    with open(data_file, "w") as f:
        json.dump(data, f, indent=2)


# Our default route
@app.route("/")
def index():
    return render_template("index.html")

# The results route
@app.route("/results")
def results():
    data = load_data()
    return render_template("results.html", data=data)



#Record a player choice from fetch().
@app.route("/submit_choice", methods=["POST"])
def submit_choice():
    payload = request.get_json()
    
    # Handling error code
    if not payload or "choice" not in payload:
        return jsonify(error="Invalid request"), 400

# The choice here that is going to be presented
    choice = payload["choice"]
    data = load_data()

    valid_choices = {
        "forest",
        "village",
        "investigate",
        "tame_wolf",
        "scare_wolf",
        "tavern",
        "walkaway",
        "throw",
        "talk",
    }

    if choice not in valid_choices:
        app.logger.warning(f"Attempted invalid choice: {choice}")
        return jsonify(error=f"Unknown choice: {choice}"), 400

    data[choice] = data.get(choice, 0) + 1
    save_data(data)
    return jsonify(success=True, data=data)


@app.route("/get_data", methods=["GET"])
def get_data():
    """Return full JSON game state."""
    return jsonify(load_data())


# --- Story routes ---
## This is mostly the templated that we're doing here
### So depending an the app chosen, it loads the template data in the html 

@app.route("/forest")
def forest():
    return render_template("forest.html", data=load_data())


@app.route("/forest_investigate")
def forest_investigate():
    return render_template("forest_investigate.html", data=load_data())


@app.route("/wolf_tame")
def wolf_tame():
    return render_template("wolf_tame.html", data=load_data())


@app.route("/wolf_scare")
def wolf_scare():
    return render_template("wolf_scare.html", data=load_data())


@app.route("/village")
def village():
    return render_template("village.html", data=load_data())


@app.route("/tavern")
def tavern():
    return render_template("tavern.html", data=load_data())


@app.route("/ending_walkaway")
def ending_walkaway():
    return render_template("ending_walkaway.html", data=load_data())


@app.route("/ending_throw")
def ending_throw():
    return render_template("ending_throw.html", data=load_data())


@app.route("/ending_talk")
def ending_talk():
    return render_template("ending_talk.html", data=load_data())


# Except this one, this one loads when the page is not found
@app.errorhandler(404)
def page_not_found(e):
    return render_template("results.html", data=load_data()), 404

   
# run the Flask dev server; debug=True enables automatic reload on save
if __name__ == "__main__":
    app.run(debug=True)