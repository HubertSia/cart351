# The Cheese Moodboard
By Hubert Sia
For the purpose of CART 351 - Networks and Navigation
To be presented to Sabine


# Concept Overview
*The Cheese Moodboard* is a simple but playful andf communal netwoked chat mood, that viusalize collective moods through animated, cheese-themed bubbles floating in real time.

For having a more humour and fun side of the network, visitor can express how they feel by selecting one of five "cheese" mood (melty, gooey, crispy, sharp, or blue) and an optional comment to leave. These expression appear as uniquely animated bubbles that drift, bounce, and shimmer on every user's screen simutaneously.

Each participant contributes a small emotional "cheese bubble" to a shared digital field an abstract metaphor for how moods mix, overlap, and coexist within interconnected communities. Over time, the composition of the space reflects the collective emotional texture of its users sometimes bright and bubbly, sometimes blue and quiet, but always alive.


# Motivations and Intentions
The main motivation, *The Cheese Moodboard* explores affective connection in online spaces (Like public chat room such as Omgle). Often, the network and social media culture center on text and numbers and self-promotion. We sought to give participants a network environment that encourages casual and non-consequential interaction, one that gives emotions shape and then lets them mix without agendas.

The "Cheese" as a metaphor is very rich here; on one side, it is a playful metaphor ('feeling cheesy'), and on the other side, cheese is something that melts, stretches, ripens, and can crumble—that is similar to emotions and relationships. In this way, instead of emotions being a confession, they can be a texture.

Design by cheese metaphor is an invitation to play and be gentle: to be intuitive and amorphous and vital. Design can thus be made accessible for collaborative play—just what is needed for relief from any kind of tech-related anxiety.


# Implementation and Technologies
The project was built using:

- Flask (Python) — serves the web application and manages WebSocket connections

- Flask‑SocketIO — enables real‑time bi‑directional communication between all connected clients

- MongoDB Atlas — used as a persistent cloud database for storing user moods and comments

- JavaScript (Socket.IO client) — handles real‑time mood updates and bubble animation

- HTML + CSS — provide a cohesive, animated, and tactile visual interface

- dotenv — manages local environment variables securely



# Database Design

Each mood submission is stored as a document in MongoDB:

{
  "_id": "MongoObjectId",
  "mood": "gooey",
  "comment": "I’m feeling warm today!",
  "timestamp": "2025-12-07T22:00:00Z"
}



# User Interface and Interaction

1. Mood Selection

Users choose one of five moods that correspond to cheese textures — emotional metaphors grounded in tangible sensation.

2. Bubble Visualization

Every mood generates a distinct animated bubble:


- Melty → golden, pulsing, slow expansion

- Gooey → wobbly and elastic

- Crispy → flickering orange with crunchy vibration

- Sharp → rotating, angular yellow

- Blue → cool, floating calmness

3. Dynamic Movement

Bubbles bounce along the screen edges using a simple physics loop (requestAnimationFrame), embodying the liveliness of a shared “emotional soup.”

4. Impermanence

Each bubble disappears after 30 seconds, representing the fleeting nature of emotional states and keeping the space fluid.



# Conceptual Reference Points

- Playful data visualization inspired by works such as We Feel Fine by Jonathan Harris & Sep Kamvar, which captured global emotions in real time.

- Concepts of networked affect and participatory aesthetics, where emotion is rendered as shared spectacle rather than private narrative (see Jennifer Gabrys, Digital Rubbish).

- The tradition of artistic absurdity transforming the mundane (cheese) into a poetic emotional interface.

- Technical structure resembles an online ambient sculpture, maintaining state via database and continuously evolving through multiple users’ input.



# Expected Outcomes

The primary outcome is an accessible, joyful networked artwork where participants witness a shared emotional micro‑climate. Rather than broadcasting identity, each contribution simply adds color, texture, and movement to a collective mood.

Educationally, this project demonstrates:


- Real‑time bidirectional communication using WebSockets.

- Integration of a persistent database (MongoDB) for user‑generated content.

- Event‑driven user interfaces using asynchronous communication patterns.

- Cohesive front‑end motion design reflecting conceptual intention.

Through this small but dynamic platform, The Cheese Moodboard shows how web technologies can be used to visualize collective feeling as movement and form, encouraging playful empathy online.


# Technical & Ethical Notes

- No personal data (names, emails, or IPs) are recorded.

- The database stores only mood labels, comments, and timestamps.

- Environment variables (.env) secure database credentials.

- The visual style prioritizes accessibility (high contrast and legible fonts).

- The codebase and assets are original except for open-font and socket.io libraries.



# How to run:

# 1. Install dependencies
pip install flask flask-pymongo flask-cors flask-socketio python-dotenv

# 2. Create a .env file
MONGODB_USER=your_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=CART351

# 3. Run the Flask server
python main.py

# 4. Visit in your browser and have fun



# References and Tools

- Flask documentation: https://flask.palletsprojects.com

- Flask‑SocketIO documentation: https://flask-socketio.readthedocs.io

- MongoDB Atlas documentation: https://www.mongodb.com/docs/atlas/

- Font: Baloo 2 via Google Fonts

- Code base off from FLASK-MONGO EXERCISE