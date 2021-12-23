import { assertEquals, assertThrows } from "./testingDeps.js";
import Player from "../src/player.js";

Deno.test("Players stats should change correctly after a game is added", () => {
    const player = new Player("Teppo Testikäyttäjä");
    const data = {
        type: "GAME_RESULT",
        gameId: "c142b900286240855bc",
        t: 1640268431839,
        playerA: { name: "Teppo Testikäyttäjä", played: "SCISSORS" },
        playerB: { name: "Untamo Hämäläinen", played: "SCISSORS" }
    };
    assertEquals(player.winRatio(), 0)
    assertEquals(player.gamesPlayed(), 0)
    player.addGame(data);
    assertEquals(player.winRatio(), 0)
    assertEquals(player.gamesPlayed(), 1)
    assertEquals(player.mostPlayedHand(), "SCISSORS")
});

const newPlayer = new Player("Teppo Testikäyttäjä");
Deno.test("Players stats should keep up when adding multiple games", () => {
    const hands = [["ROCK", "ROCK"], ["ROCK", "SCISSORS"], ["ROCK", "PAPER"],
                   ["PAPER", "ROCK"], ["PAPER", "SCISSORS"], ["PAPER", "PAPER"],
                   ["SCISSORS", "ROCK"], ["SCISSORS", "SCISSORS"], ["SCISSORS", "PAPER"]]
    const results = ["tie", "win", "loss", "win", "loss", "tie", "loss", "tie", "win"]
    const wins =        [0    ,1     ,1      ,2     ,2      ,2     ,2      ,2     ,3]
    const games =       [1    ,2     ,3      ,4     ,5      ,6     ,7      ,8     ,9]
    
    for (let i = 0; i < hands.length; i ++) {
        const data = {
            type: "GAME_RESULT",
            gameId: i + 1,
            t: i + 1,
            playerA: { name: "Teppo Testikäyttäjä", played: hands[i][0] },
            playerB: { name: "Untamo Hämäläinen", played: hands[i][1] }
        };
        newPlayer.addGame(data);
        assertEquals(newPlayer.winRatio(), wins[i]/games[i])
        assertEquals(newPlayer.gamesPlayed(), games[i])
    }
})

Deno.test("Players games should be in correct order when returned", () => {
    assertEquals(newPlayer.getFinishedGames().map(game => game.time), [9,8,7,6,5,4,3,2,1])
    newPlayer.addGame({
        type: "GAME_RESULT",
        gameId: 0,
        t: 0,
        playerA: { name: "Teppo Testikäyttäjä", played: "ROCK" },
        playerB: { name: "Untamo Hämäläinen", played: "PAPER" }
    })
    // games should be ordered so that the latest game is first based on the timestamp
    assertEquals(newPlayer.getFinishedGames().map(game => game.time), [9,8,7,6,5,4,3,2,1,0])
})