from flask import Flask, render_template, request, jsonify
import os
import json

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/p5Test")
def run_p5():
    return render_template("p5_WithFlask.html")

@app.route("/getDataFromP5")
def get_data_from_p5():
    # get query parameters safely
    user_id = request.args.get("id")
    score = request.args.get("score")

    # sanity check
    if not user_id or not score:
        return jsonify({"error": "Missing id or score"}), 400

    app.logger.info(f"id: {user_id}")
    app.logger.info(f"score: {score}")

    # set up the file path
    folder_path = "filesForP5"
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, "p5Data.json")

    # load or create file
    if os.path.exists(file_path):
        app.logger.info("file exists")
        try:
            with open(file_path, "r") as f:
                user_list = json.load(f)
        except json.JSONDecodeError:
            app.logger.warning("Corrupted file – starting fresh.")
            user_list = []
    else:
        app.logger.info("file not exists")
        user_list = []

    # check for existing name
    name_exists = False
    old_score = None
    for u in user_list:
        if u["id"].strip().lower() == user_id.strip().lower():
            name_exists = True
            old_score = u["score"]
            u["score"] = score
            break

    # if new player, append
    if not name_exists:
        user_list.append({"id": user_id, "score": score})

    # write updated data back
    with open(file_path, "w") as f:
        json.dump(user_list, f, indent=4)

    # return depending on situation
    if name_exists:
        return jsonify({"inFile": "true", "score": old_score})
    else:
        return jsonify({"inFile": "false"})

if __name__ == "__main__":
    app.run(debug=True)