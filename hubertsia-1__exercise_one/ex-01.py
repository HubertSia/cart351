#import the library
import requests

#request token from the web
token = "9f5591303c3efa6baaf56bc26791691ee5d39588" 

#get the web URL
url = "https://api.waqi.info/search/"

#make the request with the token and city
response = requests.get(url, params={"token": token, "keyword": "montreal"})

#storing our results
results = response.json()

# print the result of the api in question    
print(results)

##-------


# # Checking the TYPE of 'results'
print(type(results))
# # in the following print, 'result' return as a <class 'dict'>. Wich means the the API is using 'dictionnairy' to store data

##-------


# # Checking the KEYS of 'results'
print(results.keys())
# # in the following print, 'result' return with two stuff: ['status', 'data']. They are stored within the api

##-------

# Checking the TYPE of 'responseData'/'data'
responseData = results['data']
## It Insterestingly, it stores the <class 'list'>

##-------
# # Check the results in my 'item' of my API
for item in responseData:
    print(item)
# # In the result, it shows all the part of the city's air quality of montreal (uid, aqi, time, station)

#---------------

print(type(item))
# # in the following print, 'item' return as a <class 'dict'>

#---------------

print(item.keys())
# # in the following print, 'item' return as dict_keys(['uid', 'aqi', 'time', 'station'])

#-------------------------

# # looping responseData to get the item's every 'station''s 'name'
for item in responseData:
    print(item["station"]["name"])
## Prints out in the following order of location, city, country

## RESULTS    
## Parc Pilon, Montreal, Canada
## Maisonneuve, Montreal, Canada
## St-Dominique, Montreal, Canada
## Drummond, Montreal, Canada
## Jardin Botanique, Montreal, Canada
## Verdun, Montreal, Canada
## Duncan, Montreal, Canada
## Anjou, Montreal, Canada
## Dorval, Montreal, Canada
## Chénier, Montreal, Canada
## Saint-Jean-Baptiste, Montreal, Canada
## Aéroport de Montréal, Montreal, Canada
## Sainte-Anne-de-Bellevue, Montreal, Canada

#---------------------------------------

# # looping responseData to get the item's every 'station''s 'geo'
for item in responseData:
        lat, lon = item["station"]["geo"] 
        print(f"lat: {lat}")
        print(f"long: {lon}")
## Prints out in the following geolocation of the area (LAT, LONG)

# # RESULTS
## Duncan, Montreal, Canada
## Anjou, Montreal, Canada
## Dorval, Montreal, Canada
## Chénier, Montreal, Canada
## Saint-Jean-Baptiste, Montreal, Canada
## Aéroport de Montréal, Montreal, Canada
## Sainte-Anne-de-Bellevue, Montreal, Canada


# # looping responseData to get the item's every 'aqi''s 'uid'
# # loop 
for item in responseData:
    station_name = item["station"]["name"]
    aqi = item["aqi"]
    uid = item["uid"]

    print(f"Station: {station_name}")
    print(f"  UID: {uid}")
    print(f"  AQI: {aqi}")



# 1. Making a feed request for a specific station with uid=5468
url_feed = "https://api.waqi.info/feed/@5468"
response_feed = requests.get(url_feed, params={"token": token})
results_feed = response_feed.json()

print("Feed request returned keys:", results_feed.keys())


# 2. Extract the data field
response_data_feed = results_feed['data']

print("Type of response_data_feed:", type(response_data_feed))

# 3. Loop through dict to see its keys and sample values
print("\nInspecting keys inside response_data_feed:")
for key, value in response_data_feed.items():
    print(f"{key}: {type(value)} -> {value if type(value) in [int, str] else '...'}")
    

# 4. Extract AQI and dominant pollutant
aqi_value = response_data_feed['aqi']
dom_pol = response_data_feed['dominentpol']

print(f"\nAir Quality Index (AQI): {aqi_value}")
print(f"Dominant Pollutant (dominentpol): {dom_pol}")

# 5. Inspect iaqi values (dictionary of pollutant indices)
iaqi = response_data_feed['iaqi']

print("\nIAQI pollutants available:")
for pollutant, details in iaqi.items():
    print(f"{pollutant}: {details}")  # each is a dict like {"v": value}
    

# 6. Use dominentpol key to find its value inside iaqi
dom_pol_value = iaqi[dom_pol]['v']

print(f"\nDominant pollutant '{dom_pol}' has value: {dom_pol_value}")



# Getting the dominant pollutant for different cities is like playing detective with the air. First, you ask the Search API: 
# “Hey, who are the suspects (stations) in this city?” — and it hands you their UIDs. 
# Next, you interrogate each suspect with the Feed API: “Alright, who’s messing up the air here?” The station spills the beans: 
# “It was pm25 all along!” Then you check its rap sheet in iaqi to see exactly how bad it’s been misbehaving. 
# Repeat the routine city by city, and you end up with a “Most Wanted Pollutants” list across the world.