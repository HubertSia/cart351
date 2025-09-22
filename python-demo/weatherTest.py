#import the lib
import requests
 
#city arg
city = "Montreal" 
 
#my api key -> you should add yours
api_key = "2ba267fc5ab5b4c99201b8efab509d99" 
 
#url to get results with the city added
url_with_city ="http://api.openweathermap.org/data/2.5/weather?q=" +city 
 
#url with the api key appeneded
url_to_send = url_with_city + "&APPID=" + api_key 
 
#make the request
response = requests.get(url_to_send) 
 
#get the response as json
data = response.json() 
 
#print
print(data)
print(type(data))
print(data.keys())
# print(type(data['weather']))
# print(len(data['weather']))
print()
weather = data['weather'][0]

for weather_item in data["weather"]:
    print (weather_item) 
    #new:: check if weather item is an instance of dictionary
    if isinstance(weather_item,dict) :
        print("here")
        for item in weather_item:
            print(f"key: {item}, value: {weather_item[item]}") #key and value
            
            
bare_url = 'http://api.openweathermap.org/data/2.5/weather'
response = requests.get(bare_url , params={"q": city, "APPID":api_key })