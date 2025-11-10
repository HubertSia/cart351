from dotenv import load_dotenv
from flask import Flask,render_template,request,redirect, url_for,session
# use flask_pymongo instead of  normal pymongo (simplifies integration)
from flask_pymongo import PyMongo  
import os

load_dotenv()  # Load variables from .env and .flaskenv
db_user = os.getenv('MONGODB_USER')
db_pass = os.getenv('DATABASE_PASSWORD')
db_name = os.getenv('DATABASE_NAME')

app = Flask(__name__)
app.secret_key = 'BAD_SECRET_KEY'
# set a config var
uri = f"mongodb+srv://{db_user}:{db_pass}@cluster0.qzy0zng.mongodb.net/{db_name}?retryWrites=true&w=majority"

app.config["MONGO_URI"] = uri
mongo = PyMongo(app)
 
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB 

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/insertTestPage')
def insertTest():
    session.pop('ids', default=None)
    return render_template("testInsert.html")


# a route
@app.route('/insertMany')
def insertMany():
    data = [
{'owner_name': 'Sarah',
'plant_name' : 'Snake Plant',
'birthDate':'2002-06-12',
'geoLoc': 'Montreal',
'descript': 'Description for the plant',
'imagePath': 'images/one.png'
},
{
'owner_name': 'Sarah',
'plant_name' :'Cactus',
'birthDate' :'2005-06-13',
'geoLoc':'Toronto',
'descript':'Description for the plant',
'imagePath': 'images/seven.png'
},
 
 {
'owner_name': 'Sarah',
'plant_name' : 'Agapanthus',
'birthDate': '2003-03-19',
'geoLoc': 'Halifax',
'descript': 'Description for the plant',
'imagePath': 'images/seventeen.png'
},
 {
'owner_name': 'Stephen',
'plant_name' : 'Baby Rubber Plant',
'birthDate ': '1999-07-18',
'geoLoc': 'Edinborough',
'descript':'Description for the plant',
'imagePath': 'images/ten.png'
},
 
{
'owner_name': 'Stephen',
'plant_name' : 'Dahlia',
'birthDate' :'2000-05-06',
'geoLoc':'London',
'descript':'Description for the plant',
'imagePath': 'images/thirteen.png'
},
 
{
'owner_name' : 'Harold',
'plant_name' : 'Daphne',
'birthDate': '2012-10-21',
'geoLoc':'New York',
'descript':'Description for the plant',
'imagePath': 'images/three.png'
},
{
'owner_name' : 'Martha',
'plant_name' : 'Daylily',
'birthDate' :'2017-08-21',
'geoLoc':'Paris',
'descript':'Description for the plant',
'imagePath': 'images/nine.png'
}
]
    try:
        # insert many works :)
        result = mongo.db.plantRepo.insert_many(data)
        session['ids'] = result.inserted_ids
        return redirect(url_for('testIds'))
    except Exception as e:
        print(e)
        
@app.route('/testIds')
def testIds():
    print(session['ids'])
    return render_template("testIds.html")
   
# a route
@app.route('/viewResults')
def viewResults(): 
    
#    result = mongo.db.plantRepo.find_one({})

    result = mongo.db.plantRepo.find()
    print(result)
    
    return render_template("viewResults.html",result=result) 


@app.route('/updateOne')
def updateOne():
      return redirect(url_for("insertTestPage"))

def updateOne():
     try:
        updatedRepoItem= mongo.db.plantRepo.find_one_and_update(
            {'plant_name' :'Agapanthus'},
            {'$set':{'descript':'a more precise description'}}
            )
        return redirect(url_for("insertTest"))
     except Exception as e:
        print(e)


@app.route('/updatePoints')
def updatePoints():
     try:
        updatedRepoItem= mongo.db.plantRepo.find_one_and_update(
            {'user' :'maria'},
            {'$inc':{'points':2}}
            )
        return redirect(url_for("insertTest"))
     except Exception as e:
        print(e)
        
@app.route('/updateOneRepeat')
def updateOneRepeat():
     try:
        updatedRepoItem= mongo.db.plantRepo.find_one_and_update(
            {'owner_name' :'Sarah'},
            {'$set':{'descript':'a more precise description for all sarahs','title':'test123'}}
            )
        return redirect(url_for("insertTest"))
     except Exception as e:
 
        print(e)
        
@app.route("/insertPlantMongo")
def insertPlantMongo():
    return render_template("insertPlantMongo.html")

@app.route("/postPlantFormFetch", methods=["POST"])
def postPlantFormFetch():
    uploadedfile = request.files['the_file']
    filePath = os.path.join(app.config['UPLOAD_FOLDER'], uploadedfile.filename)
    uploadedfile.save(filePath)

    from datetime import datetime
    format_string = "%Y-%m-%d"

    dataToMongo = {
        'owner_name': request.form['o_name'],
        'plant_name': request.form['a_name'],
        'birthDate': datetime.strptime(request.form['a_date'], format_string),
        'geoLoc': request.form['a_geo_loc'],
        'descript': request.form['a_descript'],
        'imagePath': f"uploads/{uploadedfile.filename}"
    }

    try:
        mongo.db.plantRepo.insert_one(dataToMongo)
        return {"imagePath": filePath}
    except Exception as e:
        print(e)
        return {"error": str(e)}
    

@app.route('/viewAndSearchMongo')
def viewAndSearchMongo():
    return render_template("viewAndSearchMongo.html")


@app.route('/passToFlask')
def passToFlask():
    searchField = request.args.get('a_search')
    print(f"Search received: {searchField}")

    try:
        results = list(mongo.db.plantRepo.find({'plant_name': searchField}))
        for r in results:
            r['_id'] = str(r['_id'])
        return {"test-response": results}
    except Exception as e:
        print(e)
        return {"error": str(e)}

app.run(debug = True)
