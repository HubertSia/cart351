from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

data_file = "data.json"



def load_data():

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

    with open(data_file, "r") as f:
        return json.load(f)


def save_data(data):
    """
    Save updated story data to the JSON file.
    """
    with open(data_file, "w") as f:
        json.dump(data, f, indent=2)



@app.route("/")
def index():
    """
    Crossroads — main entry point of The Collective Adventure.
    """
    return render_template("index.html")


@app.route("/results")
def results():
    """
    Display the collective summary of all world choices.
    """
    data = load_data()
    return render_template("results.html", data=data)



@app.route("/submit_choice", methods=["POST"])
def submit_choice():
    """
    API endpoint to record player decisions sent via fetch() in JavaScript.
    """
    payload = request.get_json()
    if not payload or "choice" not in payload:
        return jsonify(error="Invalid request"), 400

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
    """ API endpoint — returns full JSON data for front-end updates.Used for background color rendering and live result refresh."""
    return jsonify(load_data())



@app.route("/forest")
def forest():
    """Forest introduction scene. Users can choose to follow the sound (investigate) or return."""
    return render_template("forest.html", data=load_data())


@app.route("/forest_investigate")
def forest_investigate():
    """Wolf encounter scene — sets up tame or scare decision."""
    return render_template("forest_investigate.html", data=load_data())


@app.route("/wolf_tame")
def wolf_tame():
    """Peaceful ending for the forest branch."""
    return render_template("wolf_tame.html", data=load_data())


@app.route("/wolf_scare")
def wolf_scare():
    """Fatal ending for the forest branch."""
    return render_template("wolf_scare.html", data=load_data())



@app.route("/village")
def village():
    """Village introduction scene — transition point to the tavern subnarrative."""
    return render_template("village.html", data=load_data())


@app.route("/tavern")
def tavern():
    """ Tavern encounter — users face the tavern trouble scenario."""
    return render_template("tavern.html", data=load_data())


@app.route("/ending_walkaway")
def ending_walkaway():
    """Tavern ending — Player walks away (boring ending). """
    return render_template("ending_walkaway.html", data=load_data())


@app.route("/ending_throw")
def ending_throw():
    """Tavern ending — The cheese-throwing victory. """
    return render_template("ending_throw.html", data=load_data())


@app.route("/ending_talk")
def ending_talk():
    """Tavern ending — The drunken adventurer outcome. """
    return render_template("ending_talk.html", data=load_data())



@app.errorhandler(404)
def page_not_found(e):
    """Simple 404 template fallback if route not found."""
    return render_template("results.html", data=load_data()), 404



if __name__ == "__main__":
    app.run(debug=True)