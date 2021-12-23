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
// used in multiple tests, test results could be affected by each other
const globalPlayer = new Player("Teppo Testikäyttäjä");
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
        globalPlayer.addGame(data);
        assertEquals(globalPlayer.winRatio(), wins[i]/games[i])
        assertEquals(globalPlayer.gamesPlayed(), games[i])
    }
})

Deno.test("Players games should be in correct order when returned", () => {
    // if this fails the problem could be in the previous test
    assertEquals(globalPlayer.getFinishedGames().map(game => game.time), [9,8,7,6,5,4,3,2,1])
    globalPlayer.addGame({
        type: "GAME_RESULT",
        gameId: 0,
        t: 0,
        playerA: { name: "Teppo Testikäyttäjä", played: "ROCK" },
        playerB: { name: "Untamo Hämäläinen", played: "PAPER" }
    })
    // games should be ordered so that the latest game is first based on the timestamp
    assertEquals(globalPlayer.getFinishedGames().map(game => game.time), [9,8,7,6,5,4,3,2,1,0])
})

Deno.test("Most played hand should update correctly when games are added", () => {
    const player = new Player("Matti Meikäläinen")
    const addGamesWithHand = (hand, amount) => {
        for (let i = 0; i < amount; i++) {
            player.addGame({
                type: "GAME_RESULT",
                gameId: 0,
                t: 0,
                playerA: { name: "Matti Meikäläinen", played: hand },
                playerB: { name: "Untamo Hämäläinen", played: "PAPER" }
            })
        }
    }
    addGamesWithHand("ROCK",1)
    assertEquals(player.mostPlayedHand(), "ROCK")
    addGamesWithHand("PAPER", 2)
    assertEquals(player.mostPlayedHand(), "PAPER")
    addGamesWithHand("SCISSORS", 3)
    assertEquals(player.mostPlayedHand(), "SCISSORS")
})
