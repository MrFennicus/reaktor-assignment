import {
    assertEquals,
    assertThrows,
    assertObjectMatch
} from "./testingDeps.js";
import * as LiveService from "../services/liveService.js";
let callCount = 0;
const MockServer = {
    clients: [{ send: () => callCount++ }]
};

const beginMessage = (id) => {
    return {
        data: `"{
    "type":"GAME_BEGIN",
    "gameId":"${id}",
    "playerA":{"name":"Ukko Virtanen"},
    "playerB":{"name":"Kullervo Nieminen"}}"`
    };
};
const resultMessage = (id) => {
    return {
        data: `"{
            "type": "GAME_RESULT",
            "gameId": "${id}",
            "t": 1640280924543,
            "playerA": { "name": "Kokko Järvinen", "played": "SCISSORS" },
            "playerB": { "name": "Tapio Hämäläinen", "played": "SCISSORS" }
        }"`
    };
};
const invalidMessage = {
    data: `"{
        "type": "GAME_RESULT",
        "gameId": "0",
        "t": 1640280924543,
        "playerA": { "name": "Kokko Järvinen"},
        "playerB": { "name": "Tapio Hämäläinen", "played": "SCISSORS" }
    }"`
};

Deno.test("Live service should keep track of live games correctly", () => {
    const id = "11479b87f692e59d0eb8";
    LiveService.onMessage(beginMessage(id), MockServer);
    assertEquals(LiveService.getLiveGames().length, 1);
    LiveService.onMessage(resultMessage(id), MockServer);
    assertEquals(LiveService.getLiveGames().length, 0);
});

Deno.test("Live service should send out messages when games are started or finished", () => {
    callCount = 0;
    for(let i = 0; i < 5; i++) LiveService.onMessage(beginMessage(i), MockServer)
    assertEquals(LiveService.getLiveGames().length, 5);
    for(let i = 0; i < 5; i++) LiveService.onMessage(resultMessage(i), MockServer)
    assertEquals(LiveService.getLiveGames().length, 0);
    assertEquals(callCount, 10)
})

Deno.test("Live service should not do anything with invalid data", () => {
    for(let i = 0; i < 5; i++) LiveService.onMessage(beginMessage(i), MockServer)
    LiveService.onMessage(invalidMessage, MockServer)
    assertEquals(LiveService.getLiveGames().length, 5);
    for(let i = 0; i < 5; i++) LiveService.onMessage(resultMessage(i), MockServer)
    assertEquals(LiveService.getLiveGames().length, 0);
})