import { WebSocketServer } from "ws"
const WebSocketRouter = require("../store/webSocketRouter.js")

const TestServer = {
    server: new WebSocketServer({ port: 8080 }),

    serveData: (data) => {
        TestServer.server.clients.forEach((client) =>
            client.send(JSON.stringify(data))
        )
    },
    receiveData: () => {
        return new Promise((resolve) => {
            TestServer.server.clients.forEach((client) =>
                client.on("message", (data) =>
                    resolve(JSON.parse(data.toString()))
                )
            )
        })
    }
}

const connected = new Promise((resolve, reject) => {
    TestServer.server.on("connection", resolve)
    TestServer.server.on("error", reject)
})

test("webSocketRouter should buffer requests sent before connection is established ", async () => {
    const data = { message: "message", id: "requestId" }
    WebSocketRouter.request("message", () => {}, "requestId")
    WebSocketRouter.init()
    await connected
    return expect(TestServer.receiveData()).resolves.toEqual(data)
})

test("webSocketRouter should not crash when sent a message with an unknown request id", (done) => {
    const fnc = async () => {
        try {
            await connected
            const unknownData = {requestId: "unknown request id"}
            TestServer.serveData(unknownData)
            await new Promise(r => setTimeout(r, 100)); // wait for 100ms to catch any crashes resulting from unknown data
            done()
        } catch (e) {
            done(e)
        }
    }
    fnc()
})

test("webSocketRouter should handle events with a defined request id", async () => {
    await connected
    const requestId = Math.floor(Math.random() * 100) // generate a random id between 0 and 100
    const promise = new Promise((resolve) =>
        WebSocketRouter.setHandler(resolve, requestId)
    )
    const data = { requestId: requestId, testKey: "test value" }
    TestServer.serveData(data)
    return expect(promise).resolves.toEqual(data)
})

test("webSocketRouter should handle events with an undefined request id", async () => {
    await connected
    let requestId
    const promise = new Promise((resolve) => {
        requestId = WebSocketRouter.setHandler(resolve)
    })
    const data = { testKey: "test value", requestId: requestId }
    TestServer.serveData(data)
    return expect(promise).resolves.toEqual(data)
})

afterAll(() => TestServer.server.close())
