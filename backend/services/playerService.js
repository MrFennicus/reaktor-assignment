import Player from "../src/player.js"

const players = {} // dictionary where key is the players name and value is the corresponding Player object

const fetchData = async (pathname = "/rps/history") => {
    const url = new URL(pathname, "https://bad-api-assignment.reaktor.com/")
    try {
        const data = await fetch(url)
        const body = JSON.parse(await data.text())
        body.data.forEach((gameData) => addGame(gameData))
        if (body.cursor) await fetchData(body.cursor)
    } catch (e) {
        // TODO proper error handling
        console.log(e)
    }
}

export const addGame = (gameData) => {
    if (!(gameData.playerA.name in players))
        players[gameData.playerA.name] = new Player(gameData.playerA.name)
    if (!(gameData.playerB.name in players))
        players[gameData.playerB.name] = new Player(gameData.playerB.name)

    players[gameData.playerA.name].addGame(gameData)
    players[gameData.playerB.name].addGame(gameData)
}

// returns game objects as an array or an empty array if not found
export const getGamesByPlayer = (name, page) => {
    const player = players[name]
    const gamesPerPage = 10;
    const games = player && player.finishedGames ? player.finishedGames : []
    const pageCount = Math.ceil(games.length/10);
    const gamesToReturn = games.slice(page*gamesPerPage, (page)*gamesPerPage+ gamesPerPage);
    const playerStats = getPlayerStats(name);
    return {games: gamesToReturn, pageCount: pageCount, playerStats: playerStats};
    
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
        mostPlayedHand: players[playerName].mostPlayedHand(),
    }
}

fetchData()
