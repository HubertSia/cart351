
# 1 - Import required libraries -----
from flask import Flask,render_template,request
import os

# 2 - Initialize the Flask app
app = Flask(__name__)


# 3 - the default route
@app.route("/")
def index():
      return render_template("index.html")

#*************************************************

#Task: Variables and JinJa Templates

    # i. Define Python variables to pass into the template
@app.route("/t1")
def t1():
    the_topic = "donuts"
    number_of_donuts = 28
    
    # ii. Dictionary with lists for donut flavours and toppings
    donut_data = {
        "flavours": ["Regular", "Chocolate", "Blueberry", "Devil's Food"],
        "toppings": ["None", "Glazed", "Sugar", "Powdered Sugar", "Chocolate with Sprinkles", "Chocolate", "Maple"]
    }

    # iii. Separate list for possible ice cream pairings
    icecream_flavors = ["Vanilla", "Raspberry", "Cherry", "Lemon"]

    # iiii. Pass all variables to t1.html template
    return render_template(
        "t1.html",
        the_topic=the_topic,
        number_of_donuts=number_of_donuts,
        donut_data=donut_data,
        icecream_flavors=icecream_flavors
    )
#*************************************************

#Task: HTML Form get & Data 

# i. Route to show the form (GET only)
@app.route("/t2")
def t2():
    return render_template("t2.html")

# ii. Route to process the form data
@app.route("/thank_you_t2")
def thank_you_t2():
    #iii. Get form inputs from URL parameters
    name = request.args.get("name", "")
    subject = request.args.get("subject", "")
    message = request.args.get("message", "")

    # iii. Combine them into one string
    combined = f"{name} {subject} {message}"

    # iii. Replace vowels with '*'
    modified = "".join("*" if ch.lower() in "aeiou" else ch for ch in combined)

    # iii Pass result to template
    return render_template("thankyou_t2.html", final_text=modified)

#*************************************************

# 4 Run the  T H I N G
app.run(debug=True)