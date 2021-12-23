import { ROCK, PAPER, SCISSORS } from "./player.js"

// Player spesific object, two are created for one actual game, one for both of the players
export class FinishedGame {
    constructor(gameData, playerName) {
        this.id = gameData.gameId
        this.time = gameData.t
        this.finished = true

        // figure out which player is 
        if (gameData.playerA.name === playerName) {
            this.player = gameData.playerA
            this.opponent = gameData.playerB
        } else if (gameData.playerB.name === playerName) {
            this.player = gameData.playerB
            this.opponent = gameData.playerA
        } else throw new Error("Given player name must be present in game data")

        if (this.player.played === this.opponent.played) this.result =  "tie"
        else
            switch (this.player.played) {
                case ROCK:
                    this.result =
                        this.opponent.played === SCISSORS ? "win" : "loss"
                    break
                case PAPER:
                    this.result = this.opponent.played === ROCK ? "win" : "loss"
                    break
                case SCISSORS:
                    this.result =
                        this.opponent.played === PAPER ? "win" : "loss"
                    break
                default:
                    this.result = "undetermined"
            }
    }
}

// General object, only one is created per game
export class LiveGame {
    constructor(data) {
        this.finished = false
        this.id = data.gameId
        this.time = data.t
        this.playerA = data.playerA
        this.playerB = data.playerB
    }
}
