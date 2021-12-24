import { StandardWebSocketClient, WebSocketServer } from "./deps.js"
import * as liveService from "./services/liveService.js"
import * as playerService from "./services/playerService.js"

let port = 8080
if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1]
    port = Number(lastArgument)
}
console.log(`serving on ${port}`)

const webSocketServer = new WebSocketServer(port)
const webSocketClient = new StandardWebSocketClient(
    "wss://bad-api-assignment.reaktor.com/rps/live"
)
playerService.fetchData(webSocketServer)
webSocketClient.on("open", () => {
    console.log("web socket client connected!")
})
webSocketClient.on("message", (message) => {
    liveService.onMessage(message, webSocketServer)
})
webSocketClient.on("error", console.log)

webSocketServer.on("connection", (ws) => {
    const serveOnWebSocket = (data, requestId) => {
        ws.send(
            JSON.stringify(Object.assign({}, data, { requestId: requestId }))
        )
    }

    // when connected, send out all currently ongoing games
    serveOnWebSocket({ liveGames: liveService.getLiveGames() }, "live")

    // serve data when requested by the client
    ws.on("message", (message) => {
        const data = JSON.parse(message)
        const [request, ...args] = data.message.split("/")

        // calls the given function with resolved arguments and serves the data
        const route = (fnc, nofArgs) => {
            if (args.length === nofArgs) {
                serveOnWebSocket(fnc(...args), data.id)
            } else ws.send(`invalid request ${message}`)
        }

        switch (request) {
            case "games":
                route(playerService.getGamesByPlayer, 2)
                break
            case "players":
                route(playerService.getPlayerStats, 1)
                break
            default:
                ws.send(`invalid request ${message}`)
        }
    })
    ws.on("error", console.log)
})
webSocketServer.on("error", console.log)
