import { FinishedGame } from "./game.js";

// string constants to avoid typos and increase maintainability
export const ROCK = "ROCK";
export const PAPER = "PAPER";
export const SCISSORS = "SCISSORS";

export default class Player {
    constructor(name) {
        this.name = name;
        this.finishedGames = [];
        this.liveGames = [];
        this.wins = 0.0;
        this.losses = 0.0;
        this.ties = 0.0;
        this.undeterminedGames = 0.0;
        this.moveCounts = { [ROCK]: 0, [PAPER]: 0, [SCISSORS]: 0 }; // keeps track of how many of each move the player has played
    }

    addGame(gameData) {
        const finishedGame = new FinishedGame(gameData, this.name);
        // increment ties, losses or wins based on the result of the game
        switch (finishedGame.result) {
            case "win":
                this.wins += 1;
                break;
            case "tie":
                this.ties += 1;
                break;
            case "loss":
                this.losses += 1;
                break;
            default:
                this.undeterminedGames += 1;
                break;
        }
        // increment the appropriate move counter
        const played = finishedGame.player.played;
        this.moveCounts[played] += 1;

        this.finishedGames.unshift(finishedGame);
        this.liveGames.filter((game) => game.id !== gameData.id);
    }

    gamesPlayed() {
        return this.wins + this.losses + this.ties + this.undeterminedGames;
    }
    winRatio() {
        return this.wins / this.gamesPlayed();
    }

    // goes through the move counts and returns the key with biggest count (one of "ROCK", "PAPER" or "SCISSORS")
    mostPlayedHand() {
        return Object.keys(this.moveCounts).reduce((a, b) =>
            this.moveCounts[a] < this.moveCounts[b] ? a : b
        );
    }
}
