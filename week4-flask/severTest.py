from flask import Flask, render_template 

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("pineapple.html")


@app.route('/two')
def two():
    return render_template("pineapple_two.html")

@app.route('/three')
def three():
    someNewVar = "Sabine"
    someList = ["one","two","three"]
    someDict = {"color":"yellow", "feature":"spiky","taste":"delicious"}
    return render_template("pineapple_three.html",
                           my_variable = someNewVar, 
                           my_list = someList,
                           my_dict = someDict)



@app.route('/four')
def four():
    a_new_list = [1,2,3,4,5,6,7]
    b_new_list = ["yellow","orange","blue", "green", "turquoise","fuscia","navy"]
    userLoggedIn = True
    return render_template("pineapple_four.html",
                         a_num_list = a_new_list, 
                         color_list =  b_new_list, 
                         userLoggedInHTML = userLoggedIn  )
app.run(debug=True)