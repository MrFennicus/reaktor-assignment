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
This is provided in the assignment and is currently (22.12.2021) running on Reaktor's [servers](https://bad-api-assignment.reaktor.com/).
2. Deno backend  
Parses data from the API and keeps track of currently ongoing games.
Runs on Deno framework.  
Only provides a WebSocket endpoint for easy deployment on Heroku which allows only one port to be used per app. Deployed to wss://reaktor-assignment-backend.herokuapp.com
3. React frontend, served on a static Deno server. 
Deployed to https://reaktor-assignment-frontend.herokuapp.com

A separate database could have also been setup for easier and more robust data retrieval but was omitted for simplicity. 

## Installation
### Deno
Get info on installing Deno [here](https://deno.land/manual/getting_started/installation).  
Backend dependencies are referenced in `/backend/deps.js` with URLs so no separate installation step is required.  
### Node.js
The frontend is also served on a Deno server, but Node.js and npm are used for building and installing dependencies, get them [here](https://nodejs.org/en/).  
When Node.js and Deno are installed, install dependencies with `npm install` and build the app with `npm run build`. The build step requires the backend 
server's address to be configured as REACT_APP_WEBSOCKETSERVER environment variable. (For example on Windows run `$Env:REACT_APP_WEBSOCKETSERVER = "ws://localhost:8080"` *before* building to use local backend.) 

## Usage
### Backend
Run `npm run startBackend` to start the server on ws://localhost:8080. If npm is not installed you can alternatively run `deno run --allow-all .\app.js` in `/backend`.
### Frontend
After installation and build steps run `npm run startFrontend` in the root folder to start a Deno server to host the frontend on http://localhost:3000.  
## Dependencies
### Backend
[deno websocket](https://deno.land/x/websocket@v0.1.3)  
[Oak](https://deno.land/x/oak@v10.1.0)  
### Frontend
[react](https://reactjs.org/)  
[react-fontawesome](https://github.com/FortAwesome/react-fontawesome)  
[create-react-app](https://create-react-app.dev/)  
