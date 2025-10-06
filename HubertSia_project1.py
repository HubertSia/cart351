#------ This imports the api
import requests

#------ Import the randomness to simulate the random revolver chamber
import random

# ------ Import controls for the timer
import time

# ------ Import system and precise control over the stdout (slow print)
import sys

# ------ Import both pyglet and the colorama library to python
import pyfiglet
from colorama import Fore, Style


# Here's the token, good luck = 9f5591303c3efa6baaf56bc26791691ee5d39588

# Dont know what city to take go to = https://aqicn.org/city/montreal/


# =====  The engine for the suspense and visual display ===========

# --- Cinematic typewriter output
def slow_print(text, delay=0.05, newline=True):

#----- Prints text character by character with optional delay and newline.
    for c in text:
        sys.stdout.write(c)
        sys.stdout.flush()
        time.sleep(delay)
    if newline:
        print()

# ---  The thinking engine
def suspense_dots(msg="Thinking"):
    
#------- Prints a suspense-building message with a three-dot animation
    slow_print(msg, delay=0.05, newline=False)
    for _ in range(3):
        time.sleep(0.6)
        sys.stdout.write(".")
        sys.stdout.flush()
    print("\n")


# ===== Shooot the api ======
def get_aqi(city, token):

# ----- Fetch the api
    url = f"https://api.waqi.info/feed/{city}/?token={token}"
    response = requests.get(url, timeout=10)
    response.raise_for_status()  
    return response.json()



def interpret_aqi(aqi):

    #---- All the comments that shows depending on the level air quality of the city
    if aqi <= 10:
        return "The air is pure and forgiving. You breathe gently into survival :D"
    elif aqi <= 50:
        return "The air holds a weight. You live, but uneasily... "
    elif aqi <= 100:
        return "The haze thickens. Each breath reminds you of chance"
    elif aqi <= 150:
        return "The air burns... survival feels like borrowed time"
    else:
        return "Toxic fog engulfs you. Each breath is a wager you may lose X_X"



# ===== Pick or randomize =====

# --- Function picks a random real city using WAQI’s geo coordinates API   
def random_city_from_api(token):

    # Try multiple times in case certain random coordinates fail
    for _ in range(5):
        # Generate random coordinates globally
        lat = random.uniform(-60, 70)
        lon = random.uniform(-180, 180)

        # Build API URL with geo coordinates as city replacement
        url = f"https://api.waqi.info/feed/geo:{lat:.2f};{lon:.2f}/?token={token}"

        # Response time for the request
        try:
            response = requests.get(url, timeout=10)
            data = response.json()
            if data.get("status") == "ok":
                # Extract city name from API data
                city_name = data["data"]["city"]["name"]

                # Dramatic reveal of random city
                slow_print(
                    Fore.MAGENTA
                    + f"\nFate spins the globe... You land in {city_name} "
                    + Style.RESET_ALL
                )
                return city_name
        except requests.RequestException:
          
            # If there’s a connection or timeout error, just loop again
            pass

    # If no valid location found after attempts, default to Montreal
    return "montreal"




# ===== The main game that's going in the terminal =======
def main():
    
    # --- Prints the title and the color
    print(Fore.CYAN + pyfiglet.figlet_format("Air Quality Roulette") + Style.RESET_ALL)


    # ===== This the menu =====
    # Choice of picking a city or pick a random city
    print("\nWhere will fate find you today?")
    print("1. Enter your own city")
    print("2. Let fate pick a random location on Earth")

    choice = input("\nSelect option (1 or 2): ").strip()

    # If user pick "2", start the randomizer
    if choice == "2":
        suspense_dots("Spinning the globe")
        # Enter the API and assign in token and assign the randomizer to the city 
        token = input("Enter your Token: ").strip()
        city = random_city_from_api(token)
    else:
        city = input("Enter your city: ").strip()
        token = input("Enter your WAQI Token: ").strip()


    # ------Try fetching AQI
    try:
        data = get_aqi(city, token)
    
    # In case of error
    except Exception as e:
        slow_print(Fore.RED + f"Error fetching data: {e}" + Style.RESET_ALL)
        return

    if data.get("status") != "ok" or "data" not in data:
        slow_print(Fore.YELLOW + "Could not fetch AQI data." + Style.RESET_ALL)
        return

    # ----- Suspense phase
    suspense_dots("Loading the revolver")
    suspense_dots("Spinning the cylinder")
    suspense_dots("Pulling the trigger")

    time.sleep(1.5)
    chamber = random.randint(1, 6)

    #==== Fate decision ======
    
    #----If toxic, user is ded
    if chamber == 1:
        print(Fore.RED + pyfiglet.figlet_format("BANG!") + Style.RESET_ALL)
        slow_print("The chamber fires. Your forecast dies with you...")
        return
    
    #---- If Air quality good, players lives
    else:
        print(Fore.GREEN + pyfiglet.figlet_format("CLICK") + Style.RESET_ALL)
        slow_print("An empty chamber. Fate spares you this time.\n")

    # ----- Extract AQI data for the results
    try:
        data_block = data["data"]
        aqi = data_block.get("aqi", "unknown")
        dom = data_block.get("dominentpol", "unknown")
        iaqi = data_block.get("iaqi", {})

        # ===== The game over status  =====
        # If the air quality is above 150, it is a game over
        if isinstance(aqi, int) and aqi > 150:
            print(Fore.RED + pyfiglet.figlet_format("BANG!") + Style.RESET_ALL)
            slow_print("The toxic air fills your lungs... The world fades to gray.")
            slow_print("Fate didn’t need the revolver this time — the air made its move.")
            return

        slow_print(f"City: {data_block['city']['name']}")
        slow_print(f"Air Quality Index: {aqi}")
        slow_print(f"Dominant pollutant: {dom.upper()}")

        # ==== Detailed metrics========
        if "pm25" in iaqi:
            slow_print(f"PM2.5 level: {iaqi['pm25']['v']}")
        if "t" in iaqi:
            slow_print(f"Temperature: {iaqi['t']['v']}°C")
        if "h" in iaqi:
            slow_print(f"Humidity: {iaqi['h']['v']}%")

        #----- Forecast check
        forecast_list = (
            data_block.get("forecast", {}).get("daily", {}).get("pm25", [])
        )
        if len(forecast_list) > 1:
            tomorrow = forecast_list[1]
            slow_print(
                f"\nTomorrow’s PM2.5 forecast: avg {tomorrow['avg']}, "
                f"range {tomorrow['min']}-{tomorrow['max']}"
            )
        else:
            slow_print("\nNo forecast data for tomorrow available.")

        # ------ Interpretation and closing text
        if isinstance(aqi, int):
            slow_print("\nInterpretation:\n" + interpret_aqi(aqi))
        else:
            slow_print("\nNo valid AQI value to interpret.")

        slow_print("\nYou live... but the air decides for how long.\n")

    except Exception as e:
        slow_print(Fore.RED + f"Error while interpreting data: {e}" + Style.RESET_ALL)


if __name__ == "__main__":
    main()