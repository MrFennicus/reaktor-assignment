import { LiveGame } from "../src/game.js"
import * as PlayerService from "../services/playerService.js"

const liveGames = {}

export const onMessage = (message, server) => {
    const result = validResult(message)
    const begin = validBegin(message)
    if (result) finishGame(result, server)
    else if (begin) addGame(begin, server)
}

const validResult = (message) => {
    const data = JSON.parse(message.data.replace(/\\"/g, '"').slice(1, -1))
    if (
        data &&
        data.gameId &&
        data.t &&
        data.playerA &&
        data.playerA.name &&
        data.playerA.played &&
        data.playerB &&
        data.playerB.name &&
        data.playerB.played &&
        data.type == "GAME_RESULT"
    )
        return data
    else return undefined
}
const validBegin = (message) => {
    const data = JSON.parse(message.data.replace(/\\"/g, '"').slice(1, -1))
    if (
        data &&
        data.gameId &&
        data.playerA &&
        data.playerB &&
        data.type == "GAME_BEGIN"
    )
        return data
    else return undefined
}

const addGame = (gameData, server) => {
    liveGames[gameData.gameId] = new LiveGame(gameData)
    server.clients.forEach((client) =>
        client.send(
            JSON.stringify({
                liveGames: [liveGames[gameData.gameId]],
                requestId: "live"
            })
        )
    )
}

const finishGame = (gameData, server) => {
    const id = gameData.gameId
    const game = liveGames[id]
    if (id in liveGames) {
        delete liveGames[id]
        PlayerService.addGame(gameData)
        server.clients.forEach((client) =>
            client.send(
                JSON.stringify({
                    liveGames: [{ id: id, finished: true }],
                    requestId: "live"
                })
            )
        )
    }
}

export const getLiveGames = () => {
    return Object.keys(liveGames).map((key) => liveGames[key])
}

export const getLiveGameById = (id) => {
    return liveGames[id]
}
