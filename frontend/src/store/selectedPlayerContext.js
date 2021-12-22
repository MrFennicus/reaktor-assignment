import { createContext, useState, useEffect } from "react"
import * as webSocketRouter from "./webSocketRouter"

const SelectedPlayerContext = createContext()
webSocketRouter.init()


export const SelectedPlayerContextProvider = (props) => {
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [player, setPlayer] = useState({})
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(false)
    const [dataReady, setDataReady] = useState(false)

    webSocketRouter.setHandler((data) => {
        setDataReady(data.dataReady)
        update(player)
    }
        , "dataReady")

    const pageUp = () => {
        setPage((prevValue) => Math.min(prevValue + 1, pageCount))
    }
    const pageUpUp = () => {
        setPage(pageCount)
    }
    const pageDown = () => {
        setPage((prevValue) => Math.max(prevValue - 1, 1))
    }
    const pageDownDown = () => {
        setPage(1)
    }

    // set page to 1 when the player is changed
    useEffect(() => {
        setPage(1)
    }, [player])

    const setPlayerHandler = (player) => {
        setPlayer(player)
        update(player)
    }

    const update = (player) => {
        setLoading(true)
        webSocketRouter.request(`games/${player.name}/${page - 1}`, handleDataFromServer)
    }

    const handleDataFromServer = (data) => {
        setPageCount(data.pageCount)
        setGames(data.games)
        setLoading(false)
        setDataReady(data.dataReady)
    }

    const context = {
        player: player,
        games: games,
        loading: loading,
        page: page,
        pageCount: pageCount,
        dataReady: dataReady,
        pageUp: pageUp,
        pageDown: pageDown,
        pageUpUp: pageUpUp,
        pageDownDown: pageDownDown,
        setPlayer: setPlayerHandler,
    }

    return (
        <SelectedPlayerContext.Provider value={context}>
            {props.children}
        </SelectedPlayerContext.Provider>
    )
}

export default SelectedPlayerContext
