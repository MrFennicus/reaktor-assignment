import {LiveGame, FinishedGame} from "../src/game.js"
import { assertEquals, assertThrows} from "./testingDeps.js";

Deno.test("Live game should initialize correctly", () => {
    const data = {
        playerA: {
            name: "Antti Ahtisaari"
        },
        playerB: {
            name: "Bertta Bukowski"
        },
        gameId: "a1b2c3d4e5f6",
        t: 123456789,
    }
    const game = new LiveGame(data)
    assertEquals(game.playerA, data.playerA)
    assertEquals(game.playerB, data.playerB)
    assertEquals(game.id, data.gameId)
    assertEquals(game.time, data.t)
    assertEquals(game.finished, false)
})

Deno.test("Finised game should initialize correctly", () => {
    const data = {
        playerA: {
            name: "Antti Ahtisaari",
            played: "ROCK"
        },
        playerB: {
            name: "Bertta Bukowski",
            played: "SCISSORS"
        },
        gameId: "a1b2c3d4e5f6",
        t: 123456789,
    }
    const game = new FinishedGame(data, "Bertta Bukowski")
    assertEquals(game.player, data.playerB)
    assertEquals(game.opponent, data.playerA)
    assertEquals(game.id, data.gameId)
    assertEquals(game.time, data.t)
    assertEquals(game.finished, true)
    assertEquals(game.result, "loss")
})

Deno.test("Finished game should resolve game result correctly with all combinations", () => {
    const hands = [["ROCK", "ROCK"], ["ROCK", "SCISSORS"], ["ROCK", "PAPER"],
                   ["PAPER", "ROCK"], ["PAPER", "SCISSORS"], ["PAPER", "PAPER"],
                   ["SCISSORS", "ROCK"], ["SCISSORS", "SCISSORS"], ["SCISSORS", "PAPER"]]
    const results = ["tie", "win", "loss", "win", "loss", "tie", "loss", "tie", "win"]
    for (let i = 0; i < hands.length; i ++) {
        const data = {
            playerA: {
                name: "Antti Ahtisaari",
                played: hands[i][0]
            },
            playerB: {
                name: "Bertta Bukowski",
                played: hands[i][1]
            },
            gameId: "a1b2c3d4e5f6",
            t: 123456789,
        }
        const game = new FinishedGame(data, "Antti Ahtisaari")
        assertEquals(game.player, data.playerA)
        assertEquals(game.opponent, data.playerB)
        assertEquals(game.id, data.gameId)
        assertEquals(game.time, data.t)
        assertEquals(game.finished, true)
        assertEquals(game.result, results[i]) 
    } 
})

Deno.test("Finished game should resolve game result correctly even when playerA and playerB have the same name", () => {
    const hands = [["ROCK", "ROCK"], ["ROCK", "SCISSORS"], ["ROCK", "PAPER"],
                   ["PAPER", "ROCK"], ["PAPER", "SCISSORS"], ["PAPER", "PAPER"],
                   ["SCISSORS", "ROCK"], ["SCISSORS", "SCISSORS"], ["SCISSORS", "PAPER"]]
    const results = ["tie", "win", "loss", "win", "loss", "tie", "loss", "tie", "win"]
    for (let i = 0; i < hands.length; i ++) {
        const data = {
            playerA: {
                name: "Timo Testikäyttäjä",
                played: hands[i][0]
            },
            playerB: {
                name: "Timo Testikäyttäjä",
                played: hands[i][1]
            },
            gameId: "a1b2c3d4e5f6",
            t: 123456789,
        }
        const game = new FinishedGame(data, "Timo Testikäyttäjä")
        assertEquals(game.player, data.playerA)
        assertEquals(game.opponent, data.playerB)
        assertEquals(game.id, data.gameId)
        assertEquals(game.time, data.t)
        assertEquals(game.finished, true)
        assertEquals(game.result, results[i]) 
    } 
})

Deno.test("Finished game should throw when given name doesn't match either player", () => {
    const data = {
        playerA: {name: "Not me"},
        playerB: {name: "Me neither"},
    }
    assertThrows(() => new FinishedGame(data, "New phone, who dis?"))
})
