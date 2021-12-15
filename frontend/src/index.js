import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { LiveGamesContextProvider } from "./store/liveGamesContext"
import { SelectedPlayerContextProvider } from "./store/selectedPlayerContext"

ReactDOM.render(
    <SelectedPlayerContextProvider>
        <LiveGamesContextProvider>
            <App />
        </LiveGamesContextProvider>
    </SelectedPlayerContextProvider>,
    document.getElementById("root")
)
