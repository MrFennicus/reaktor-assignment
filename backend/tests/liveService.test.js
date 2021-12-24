import { assertEquals, assertObjectMatch } from "./testingDeps.js"
import * as LiveService from "../services/liveService.js"

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
const invalidMessage = {
    data: `"{
        "type": "GAME_RESULT",
        "gameId": "0",
        "t": 1640280924543,
        "playerA": { "name": "Kokko Järvinen"},
        "playerB": { "name": "Tapio Hämäläinen", "played": "SCISSORS" }
    }"`,
}

Deno.test("Live service should keep track of live games correctly", () => {
    const id = "11479b87f692e59d0eb8"
    LiveService.handleMessage(beginMessage(id))
    assertEquals(LiveService.getLiveGames().length, 1)
    LiveService.handleMessage(resultMessage(id))
    assertEquals(LiveService.getLiveGames().length, 0)
})

Deno.test("Live service should send out messages when games are started or finished", () => {
    assertObjectMatch(JSON.parse(LiveService.handleMessage(beginMessage(12345))), {
        requestId: "live",
        liveGames: [{ finished: false, id: "12345", playerA: {}, playerB: {} }],
    })
    assertEquals(LiveService.getLiveGames().length, 1)
    assertObjectMatch(JSON.parse(LiveService.handleMessage(resultMessage(12345))), {
        requestId: "live",
        liveGames: [{ finished: true, id: "12345" }],
    })
    assertEquals(LiveService.getLiveGames().length, 0)
})

Deno.test("Live service should not do anything with invalid data", () => {
    for (let i = 0; i < 5; i++) LiveService.handleMessage(beginMessage(i))
    assertEquals(LiveService.handleMessage(invalidMessage), undefined)
    assertEquals(LiveService.getLiveGames().length, 5)
    for (let i = 0; i < 5; i++) LiveService.handleMessage(resultMessage(i))
    assertEquals(LiveService.getLiveGames().length, 0)
})
