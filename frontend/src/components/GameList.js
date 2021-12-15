import Card from "../ui/Card"
import Game from "./Game"
import classes from "./GameList.module.css"

const GameList = (props) => {
    return (
        <Card>
            <ul className={classes.list}>
                {props.games.map((game) => {
                    return (
                        <li className={classes.listItem} key={game.id}>
                            <Game
                                game={game}
                                selectPlayer={props.selectPlayer}
                                selectedPlayer={props.player}
                            />
                        </li>
                    )
                })}
            </ul>
            {props.children}
        </Card>
    )
}
export default GameList
