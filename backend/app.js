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
    // when connected, send out all currently ongoing games
    ws.send(
        JSON.stringify({
            liveGames: liveService.getLiveGames(),
            requestId: "live"
        })
    )
    // serve data when requested by the client
    ws.on("message", (message) => {
        const data = JSON.parse(message)
        const parts = data.message.split("/")
        switch (parts[0]) {
            case "games":
                if (parts.length === 3)
                    ws.send(
                        JSON.stringify(
                            Object.assign(
                                {},
                                playerService.getGamesByPlayer(
                                    parts[1],
                                    parts[2]
                                ),
                                { requestId: data.id }
                            )
                        )
                    )
                else ws.send(`invalid request ${message}`)
                break
            case "players":
                if (parts.length === 2)
                    ws.send(
                        JSON.stringify({
                            playerStats: playerService.getPlayerStats(parts[1]),
                            requestId: data.id
                        })
                    )
                else ws.send(`invalid request ${message}`)
                break
            default:
                ws.send(`invalid request ${message}`)
        }
    })
    ws.on("error", console.log)
})
webSocketServer.on("error", console.log)
