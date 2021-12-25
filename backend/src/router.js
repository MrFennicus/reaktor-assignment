import * as playerService from "../services/playerService.js"
import * as liveService from "../services/liveService.js"
import { WebSocketServer, StandardWebSocketClient } from "../deps.js"

export class Router {
    constructor(port, apiAddress) {
        this.webSocketServer = new WebSocketServer(port)
        // send a message to clients when all data has been fetched from api
        playerService.fetchData(apiAddress).then(this.sendToAll)

        this.webSocketServer.on("connection", (ws) => {
            // when connected, send out all currently ongoing games
            ws.send(this.respondWithData({ liveGames: liveService.getLiveGames() }, "live"))
            // serve data when requested by the client
            ws.on("message", (request) => ws.send(this.respondToRequest(request)))
            ws.on("error", console.log)
        })
        this.webSocketServer.on("error", console.log)
        
        const envEndpoint = Deno.env.get("DENO_API_ENDPOINT")
        const endpoint = envEndpoint ? envEndpoint : "wss://bad-api-assignment.reaktor.com/rps/live"
        this.webSocketClient = new StandardWebSocketClient(endpoint)
        this.webSocketClient.on("open", () => console.log("web socket client connected!"))
        this.webSocketClient.on("message", (message) => {
            const response = liveService.handleMessage(message)
            if (response) this.sendToAll(response)
        })
        this.webSocketClient.on("error", console.log)
    }
    sendToAll = (data) => this.webSocketServer.clients.forEach((client) => client.send(data))

    respondWithData = (data, requestId) => {
        return JSON.stringify(Object.assign({}, data, { requestId: requestId }))
    }

    respondToRequest = (requestJSON) => {
        const data = JSON.parse(requestJSON)
        const [request, ...args] = data.message.split("/")
        const respondWithFunction = (fnc, nofArgs) => {
            if (args.length === nofArgs) {
                return this.respondWithData(fnc(...args), data.id)
            } else return `invalid request ${request}`
        }

        switch (request) {
            case "games":
                return respondWithFunction(playerService.getGamesByPlayer, 2)
                break
            case "players":
                return respondWithFunction(playerService.getPlayerStats, 1)
                break
            default:
                return `invalid request ${request}`
        }
    }
}
