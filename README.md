# My submission to Reaktor's assignment for developer applicants

This app shows info about rock-paper-scissors matches played. It shows the currently ongoing games as well as the results of previous games for each player.
Some stats about past games are also calculated for each player and can be viewed by hovering over a player's name. 

The app is still under development and in addition to being a bit rough around the edges it also has multiple known bugs.

[More info about the assignmnent](https://www.reaktor.com/assignment-2022-developers/)  
[Live demo deployed to Heroku](https://reaktor-assignment-frontend.herokuapp.com/)  

## Used frameworks and application structure
The app consists of three main parts:
1. API endpoint for retrieving both live and past games. This is provided in the assignment and is currently (15.12.2021) running on Reaktor's [servers](https://bad-api-assignment.reaktor.com/).
2. Backend to parse data from the API and keep track of currently ongoing games. Backend runs on Deno framework. Only provides a WebSocket endpoint for easy deployment on Heroku which allows only one port to be used per app. Deployed to wss://reaktor-assignment-backend.herokuapp.com
3. React frontend. Deployed to https://reaktor-assignment-frontend.herokuapp.com

A separate database could have also been setup for easier and more robust data retrieval but was omitted for simplicity. 

## Installation
### Deno
Get info on installing Deno [here](https://deno.land/manual/getting_started/installation).  
Backend dependencies are referenced in `/backend/deps.js` with URLs so no separate installation step is required.  
### Node.js
The frontend requires npm (which is included in Node.js) to install dependencies, get it [here](https://nodejs.org/en/).  
When npm is installed run `npm install` in `/frontend` to install dependencies.

## Usage
### Backend
Run `deno run --allow-all .\app.js` in `/backend` to start the server.  
### Frontend
Run `npm run` in `/frontend` to start a Node development server to host the frontend on http://localhost:3000. Uses the backend on Heroku by default.
TODO: add support to change the backend server from a config file or with a command line argument.  

## Dependencies
### Backend
[deno websocket](https://deno.land/x/websocket@v0.1.3)
### Frontend
[react-fontawesome](https://github.com/FortAwesome/react-fontawesome)
