import { assert, assertObjectMatch, deadline } from "./testingDeps.js"
import { Router } from "../src/router.js"
import { StandardWebSocketClient, WebSocketServer } from "../deps.js"

const beginMessage = (id, playerA = "Ukko Virtanen") => {
    return {
        data: `"{
    "type":"GAME_BEGIN",
    "gameId":"${id}",
    "playerA":{"name":"${playerA}"},
    "playerB":{"name":"Tapio Hämäläinen"}}"`,
    }
}
const resultMessage = (id, playerA = "Ukko Virtanen") => {
    return {
        data: `"{
            "type": "GAME_RESULT",
            "gameId": "${id}",
            "t": 1640280924543,
            "playerA": { "name": "${playerA}", "played": "SCISSORS" },
            "playerB": { "name": "Tapio Hämäläinen", "played": "PAPER" }
        }"`,
    }
}

const wsTestApi = new WebSocketServer(1234)
const wsTestApiSendAll = (message) => wsTestApi.clients.forEach((client) => client.send(message))

// returns a promise that resolves to received data or throws if no data received in 5 seconds
const listen = async (socket, type) => {
    return deadline(
        new Promise((resolve) => {
            socket.on(type, resolve)
        }),
        5000
    )
}

Deno.test({
    name: "Should connect to test server",
    fn: async () => {
        const connected = listen(wsTestApi, "connection")
        Deno.env.set("DENO_API_ENDPOINT", "ws://localhost:1234")
        const router = new Router(4321, "http://not-a-real-address.nope")
        await connected
    },
    sanitizeOps: false,
    sanitizeResources: false,
})

Deno.test({
    name: "Should send out ongoing games on connect",
    fn: async () => {
        const testClient = new StandardWebSocketClient("ws://localhost:4321")
        const received = await listen(testClient, "message")
        assertObjectMatch(JSON.parse((await received).data), { requestId: "live", liveGames: [] })
    },
    sanitizeOps: false,
    sanitizeResources: false,
})

Deno.test({
    name: "Should forward received updates on live games to clients",
    fn: async () => {
        const testClient1 = new StandardWebSocketClient("ws://localhost:4321")
        const testClient2 = new StandardWebSocketClient("ws://localhost:4321")
        const received1 = listen(testClient1, "message")
        const received2 = listen(testClient2, "message")

        wsTestApiSendAll(beginMessage(123).data)

        assertObjectMatch(JSON.parse((await received1).data), {
            requestId: "live",
            liveGames: [{ finished: false, id: "123" }],
        })
        assertObjectMatch(JSON.parse((await received2).data), {
            requestId: "live",
            liveGames: [{ finished: false, id: "123" }],
        })
        const received3 = listen(testClient1, "message")
        wsTestApiSendAll(resultMessage(123).data)

        assertObjectMatch(JSON.parse((await received3).data), {
            requestId: "live",
            liveGames: [{ finished: true, id: "123" }],
        })
    },
    sanitizeOps: false,
    sanitizeResources: false,
})

Deno.test({
    name: "Should serve requested data",
    fn: async () => {
        // setup
        const testClient = new StandardWebSocketClient("ws://localhost:4321")
        await listen(testClient, "open") // wait for connection
        await listen(testClient, "message") // wait for ongoing live games
        wsTestApiSendAll(beginMessage(111, "Tuomo Testikäyttäjä").data)
        await listen(testClient, "message") // wait for updated live games
        wsTestApiSendAll(resultMessage(111, "Tuomo Testikäyttäjä").data)
        await listen(testClient, "message") // wait for updated live games

        // request
        const received1 = listen(testClient, "message") // listen for requested data
        testClient.send(JSON.stringify({ message: "players/Tuomo Testikäyttäjä", id: "stats" })) // send the request
        assertObjectMatch(JSON.parse((await received1).data), {
            winRatio: 1,
            mostPlayedHand: "SCISSORS",
            requestId: "stats",
        })

        const received2 = listen(testClient, "message") // listen for requested data
        testClient.send(JSON.stringify({ message: "games/Tuomo Testikäyttäjä/0", id: "games" }))
        assertObjectMatch(JSON.parse((await received2).data), { games: [], requestId: "games" })
        
    },
    sanitizeOps: false,
    sanitizeResources: false,
})
