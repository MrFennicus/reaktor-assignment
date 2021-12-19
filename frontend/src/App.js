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
            <Card className = {classes.LiveGames}>
                
                <GameList
                    games={liveGamesCtx.games}
                    selectPlayer={selectPlayer}
                    className = {classes.LiveGames}
                    />

            </Card>

            <Card className={classes.PlayerInfo}>
                {player === undefined ? (
                    <Card>Select a player to see more information</Card>
                ) : (
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
            </Card>
        </div>
    )
}

export default App
