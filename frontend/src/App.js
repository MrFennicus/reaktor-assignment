import GameList from "./components/GameList"
import classes from "./App.module.css"
import LiveGamesContext from "./store/liveGamesContext"
import { useContext, useState } from "react"
import Player from "./components/Player"
import Card from "./ui/Card"

const App = () => {
    const liveGamesCtx = useContext(LiveGamesContext)
    const [player, setPlayer] = useState(undefined)
    const selectPlayer = (plr) => {
        setPlayer(plr)
    }

    return (
        <div className={classes.App}>
            <div className={classes.LiveGames}>
                <h1>Live games</h1>
                <GameList
                    games={liveGamesCtx.games}
                    selectPlayer={selectPlayer}
                    className={classes.LiveGames}
                />
            </div>

            <div className={classes.PlayerInfo}>
                {player !== undefined && (
                    <Player
                        player={player}
                        liveGames={liveGamesCtx.games.filter((game) =>
                            [game.playerA.name, game.playerB.name].includes(
                                player.name
                            )
                        )}
                        selectPlayer={selectPlayer}
                    />
                )}
            </div>
        </div>
    )
}

export default App
