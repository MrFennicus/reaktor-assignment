import { assert,  assertObjectMatch,  deadline} from "./testingDeps.js"
import { Router } from "../src/router.js"
import { StandardWebSocketClient, WebSocketServer } from "../deps.js"

const beginMessage = (id) => {
    return {
        data: `"{
    "type":"GAME_BEGIN",
    "gameId":"${id}",
    "playerA":{"name":"Ukko Virtanen"},
    "playerB":{"name":"Kullervo Nieminen"}}"`,
    }
}
const resultMessage = (id) => {
    return {
        data: `"{
            "type": "GAME_RESULT",
            "gameId": "${id}",
            "t": 1640280924543,
            "playerA": { "name": "Kokko Järvinen", "played": "SCISSORS" },
            "playerB": { "name": "Tapio Hämäläinen", "played": "SCISSORS" }
        }"`,
    }
}

const testServer = new WebSocketServer(1234)

// returns a promise that resolves to received data or throws if no data received in 5 seconds
const listen = async (socket, type) => {
    return deadline(new Promise((resolve) => {
        socket.on(type, resolve)
    }), 5000)
}

Deno.test({name: "Should connect to test server", fn:  async () => {
    const connected = listen(testServer, "connection")
    Deno.env.set("DENO_API_ENDPOINT", "ws://localhost:1234")
    const router = new Router(4321)
    await connected
}, sanitizeOps: false, sanitizeResources: false})

Deno.test({name: "Should send out ongoing games on connect", fn: async () => {
    const testClient = new StandardWebSocketClient("ws://localhost:4321")
    const received = await listen(testClient, "message")
    assertObjectMatch((JSON.parse((await received).data)), {requestId: "live", liveGames: []})
}, sanitizeOps: false, sanitizeResources: false})

Deno.test({name: "Should forward received updates on live games to clients", fn: async () => {
    const testClient1 = new StandardWebSocketClient("ws://localhost:4321")
    const testClient2 = new StandardWebSocketClient("ws://localhost:4321")
    const received1 = listen(testClient1, "message")
    const received2 = listen(testClient2, "message")

    testServer.clients.forEach(client =>  client.send(beginMessage(123).data));

    assertObjectMatch((JSON.parse((await received1).data)), {requestId: "live", liveGames: [{finished: false, id:"123"}]})
    assertObjectMatch((JSON.parse((await received2).data)), {requestId: "live", liveGames: [{finished: false, id:"123"}]})
    const received3 = listen(testClient1, "message")
    testServer.clients.forEach(client =>  client.send(resultMessage(123).data));

    assertObjectMatch((JSON.parse((await received3).data)), {requestId: "live", liveGames: [{finished: true, id:"123"}]})
}, sanitizeOps: false, sanitizeResources: false})

// Deno.test({name: "Should serve requested data", fn: async () => {
//     const testClient = new StandardWebSocketClient("ws://localhost:4321")
//     await listen(testClient, "open")  // wait for connection
//     await listen(testClient, "message") // wait for ongoing live games

//     // testClient.send(JSON.stringify({message: "players/Kokko Järvinen", id: "myRequestId"}))
//     testClient.send(JSON.stringify({message: "games/Kokko Järvinen/0", id: "myRequestId"}))
//     const received = listen(testClient, "message")
//     console.log((await received).data)
//     // assertObjectMatch((JSON.parse((await received).data)), {})
// }, sanitizeOps: false, sanitizeResources: false})