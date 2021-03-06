import Player from "../src/player.js"

const players = {} // dictionary where key is the players name and value is the corresponding Player object
let dataReady = false

export const fetchData = async (apiAddress, pathname = "/rps/history") => {
    try {
        const url = new URL(pathname, apiAddress)
        const data = await fetch(url)
        const text = await data.text()
        const body = JSON.parse(text)
        body.data.forEach((gameData) => addGame(gameData))
        if (body.cursor) return fetchData(apiAddress, body.cursor)
        else  {
            dataReady = true
            return (JSON.stringify({dataReady: true, requestId: "dataReady"}))
        }
    } catch (e) {
        // Something went wrong, wait for a bit and try again.
        await new Promise((r) => setTimeout(r, 2000))
        return fetchData(apiAddress, pathname)
    }
}

export const onDataReady = (callback) => dataReadyCallback = callback

export const addGame = (gameData) => {
    if (!(gameData.playerA.name in players))
        players[gameData.playerA.name] = new Player(gameData.playerA.name)
    if (!(gameData.playerB.name in players))
        players[gameData.playerB.name] = new Player(gameData.playerB.name)

    players[gameData.playerA.name].addGame(gameData)
    // Don't add twice if game is against oneself
    if (gameData.playerA.name !== gameData.playerB.name)
        players[gameData.playerB.name].addGame(gameData)
}

// returns game objects as an array or an empty array if not found
export const getGamesByPlayer = (name, page) => {
    const player = players[name]
    const gamesPerPage = 10
    const games =
        player && player.finishedGames ? player.getFinishedGames() : []
    const pageCount = Math.ceil(games.length / 10)
    const gamesToReturn = games.slice(
        page * gamesPerPage,
        page * gamesPerPage + gamesPerPage
    )
    const playerStats = getPlayerStats(name)
    return {
        games: gamesToReturn,
        pageCount: pageCount,
        playerStats: playerStats,
        dataReady: dataReady
    }
}

// returns all player objects in an array
export const getPlayers = () => {
    return Object.keys(players).map((key) => players[key])
}
export const playerCount = () => {
    return Object.keys(players).length
}

export const getPlayerStats = (playerName) => {
    return {
        winRatio: players[playerName].winRatio(),
        mostPlayedHand: players[playerName].mostPlayedHand()
    }
}

