**INFO FOR README ON EX5**


QUERY THREE — POSITIVE AFTER‑MOODS

MongoDB Query Explanation

	results = mongo.db.dataStuff.find({"after_mood": {"$in": positive_moods}})


- This query selects all entries where after_mood belongs to the predefined list positive_moods (['happy','neutral','calm','serene','well']).

- The $in operator filters only those documents whose after_mood value is within that list.

- It returns all matching documents and attaches the helper array moods so the client can access it for color mapping.

Visualization Description — displayPositiveMoods()

- The visualization uses softly colored, animated circles representing participants whose after‑mood was positive.

- Each mood type is assigned a unique color (like  teal, mint, or pastel tones).

- Points “float” around within boundaries, bouncing off screen edges, visually conveying lightness and positivity.

- Brightness subtly changes according to each data point’s motion speed, reinforcing an energetic and uplifting atmosphere.

- Intention: evoke a sense of “living energy” and buoyancy associated with positive moods.


---

QUERY FOUR — BY EVENT NAME (SORTED)

MongoDB Query Explanation

	results = mongo.db.dataStuff.find().sort("event_name", 1)


- Finds all documents and sorts them alphabetically by the event_name field.

- Sorting order 1 corresponds to ascending (A to Z).

- Returns the entire dataset along with the event_names list used for color assignment.

Visualization Description — displayByEventName()

- Each event is represented by small elements orbiting around a central point.

- Circles are distributed evenly around a rotating ring, with distinct colors per event.

- The animation continuously rotates, visually grouping all entries belonging to the same event into a dynamic orbital system.

- Intention: resemble a cosmic “constellation” of activities—events are planets in orbit, showing connected patterns and balance.


---

QUERY FIVE — MONDAY / TUESDAY BY AFFECT STRENGTH

MongoDB Query Explanation

	results = mongo.db.dataStuff.find({"day": {"$in": ["Monday", "Tuesday"]}}).sort("event_affect_strength", 1)


- Filters data to include only records that happened on Monday or Tuesday.

- Sorts the output by event_affect_strength (ascending order).

- Attaches the days array so the frontend can assign color by weekday.

Visualization Description — displayByAffectStrength()

- Data points are drawn as horizontal bars, where bar length reflects the event_affect_strength value.

- Monday entries appear in blue; Tuesday entries in magenta, producing a bi‑color contrast.

- Bars animate outward from the left, giving the impression of strength “building up”.

- Intention: visualize strength numerically yet poetically — short bars show weaker effects, long bars stronger event impact — comparing early‑week moods.


---

QUERY SIX — NEGATIVE START & AFTER MOOD, SORTED BY WEATHER

MongoDB Query Explanation

	results = mongo.db.dataStuff.find({
	    "start_mood": {"$in": negative_moods},
	    "after_mood": {"$in": negative_moods}
	}).sort("weather", 1)


- Selects entries where both the start_mood and after_mood fall into the predefined negative_moods array (['sad','angry','neutral','calm','anxious','moody','hurt']).

- Sorts these “double‑negative” mood entries alphabetically by weather.

- Returns the matching data and the helper list of negative moods to the client.

Visualization Description — displayNegativeWeather()

- Negative mood entries are displayed as colorful points forming a swirling spiral around the screen’s center.

- Each point’s hue shifts through the spectrum dynamically, pulsing like an emotional storm.

- The darker background and slow harmonic motion express introspection or turbulence typical of negative states.

- Intention: to convey emotional depth and flux, illustrating how mood and weather intertwine into a spiraling, storm‑like flow.


---

General Notes

- All visualizations use a shared myDataPoint class to render entries consistently but in unique arrangements.

- No data filtering is done on the client — all selection is done via MongoDB queries on the server.

- Each visualization explores a different metaphor for data interpretation—motion, order, rhythm, or mood, unifying the dataset through visual storytelling.