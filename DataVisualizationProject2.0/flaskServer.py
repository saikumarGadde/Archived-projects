import re
from flask import Flask, request, send_from_directory
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask( __name__, static_url_path='' )

@app.route('/')
def index():
	return render_template("index.html")

@app.route('/<path:filename>')
def send_js(filename):
   	return send_from_directory('', filename)

@app.route('/loadDataBank/<companyName>')
def loadDataBank(companyName):
	print "It came into the Second Dataset with company anme",companyName
	client = MongoClient("localhost",27017)
	db = client.testingMaps
	collection = db.things
	data = collection.find({"NAME": re.compile('.*'+companyName+'.*',re.IGNORECASE)})
	json_data = []
	for d in data:
		json_data.append(d)
	json_data = json.dumps(json_data,default=json_util.default)
	print "The json_data is returned"
	return json_data

@app.route('/loadData')
def loadData():
	print "It came into the loadData function "
	client = MongoClient("localhost",27017)
	db = client.testingcsv2
	collection = db.myData
	data = collection.find()
	json_data = []
	print "Its iterating the data now."
	for d in data:
		json_data.append(d)
	json_data = json.dumps(json_data,default=json_util.default)
	print "The json_data is returned"
	return json_data

@app.route('/loadData/<companyName>')
def loadDataOfCompany(companyName):
	print "It came into the loadData function with a company name", companyName
	client = MongoClient("localhost",27017)
	db = client.testingcsv2
	collection = db.myData
	data = collection.find({'Company':re.compile('.*'+companyName+'.*',re.IGNORECASE)})
	json_data = []
	for d in data:
		json_data.append(d)
	json_data = json.dumps(json_data,default=json_util.default)
	print "The json_data is returned"
	return json_data

@app.route('/secondPage')
def secondPage():
	return render_template("index3.html")

if ( __name__ == "__main__" ):
	app.run(host="128.119.243.147",port=5000,debug=True)