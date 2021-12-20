# My submission to Reaktor's assignment for developer applicants

This app shows info about rock-paper-scissors matches played. It shows the currently ongoing games as well as the results of previous games for each player.
Some stats about past games are also calculated for each player.

The app is still under development.

[More info about the assignmnent](https://www.reaktor.com/assignment-2022-developers/)  
[Live demo deployed to Heroku](https://reaktor-assignment-frontend.herokuapp.com/)  
(NOTE! With the free version of Heroku used for deployment, the servers for both front- and backend take a while to start up from idle.)

## Frameworks and application structure
The app consists of three main parts:
1. Provided API  
For retrieving both live and past games.  
This is provided in the assignment and is currently (20.12.2021) running on Reaktor's [servers](https://bad-api-assignment.reaktor.com/).
2. Deno backend  
Parses data from the API and keeps track of currently ongoing games.
Runs on Deno framework.  
Only provides a WebSocket endpoint for easy deployment on Heroku which allows only one port to be used per app. Deployed to wss://reaktor-assignment-backend.herokuapp.com
3. React frontend.  
Deployed to https://reaktor-assignment-frontend.herokuapp.com

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
Run `deno run --allow-all .\app.js` in `/backend` to start the server on ws://localhost:8080.  
### Frontend
Backend server's address must be configured as REACT_APP_WEBSOCKETSERVER environment variable.
On Windows run `$Env:REACT_APP_WEBSOCKETSERVER = "ws://localhost:8080"` to use local backend.
Run `npm run` in `/frontend` to start a Node development server to host the frontend on http://localhost:3000.  


## Dependencies
### Backend
[deno websocket](https://deno.land/x/websocket@v0.1.3)
### Frontend
[react-fontawesome](https://github.com/FortAwesome/react-fontawesome)
