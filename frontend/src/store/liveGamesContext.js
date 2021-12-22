import { createContext, useEffect, useState } from "react"
import * as webSocketRouter from "./webSocketRouter"

const LiveGamesContext = createContext()
webSocketRouter.init()

export const LiveGamesContextProvider = (props) => {
    const [liveGames, setLiveGames] = useState([])

    const addGame = (game) => {
        setLiveGames((prev) => prev.concat(game))
    }

    const removeGame = (id) => {
        setLiveGames((prev) => prev.filter((game) => game.id !== id))
    }

    const handleDataFromServer = ({ liveGames }) => {
        for (const game of liveGames) {
            if (game.finished === false) {
                addGame(game)
            } else {
                removeGame(game.id)
            }
        }
    }

    webSocketRouter.setHandler(handleDataFromServer, "live")

    const context = {
        games: liveGames,
        addGame: addGame
    }

    return (
        <LiveGamesContext.Provider value={context}>
            {props.children}
        </LiveGamesContext.Provider>
    )
}

export default LiveGamesContext
