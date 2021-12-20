import classes from "./Game.module.css"
import PlayerStats from "./PlayerStats"
import { useState } from "react"
import Time from "../ui/Time"
import CustomIcon from "../ui/CustomIcon"

const Game = (props) => {
    return (
        <div>
            {props.game.finished ? (
                <FinishedGame
                    game={props.game}
                    selectedPlayer={props.selectedPlayer}
                    selectPlayer={props.selectPlayer}
                />
            ) : (
                <LiveGame
                    game={props.game}
                    selectedPlayer={props.selectedPlayer}
                    selectPlayer={props.selectPlayer}
                />
            )}
        </div>
    )
}

const FinishedGame = (props) => {
    const [hover, setHover] = useState(false)

    const className = classes[props.game.result] // 'tie'/'win'/'loss'

    return (
        <div
            className={className + " " + classes.game}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div>
                <CustomIcon icon={props.game.result} /> vs{" "}
                <span
                    className="clickable"
                    onClick={() => props.selectPlayer(props.game.opponent)}
                >
                    {props.game.opponent.name}

                </span>
            </div>
            <div>
                <div className={classes.infoBox}>
                    <div>
                        <CustomIcon icon={props.game.player.played} /> vs{" "}
                        <CustomIcon icon={props.game.opponent.played} />
                    </div>
                    <Time
                        className={hover ? "" : classes.hidden}
                        time={props.game.time}
                    />
                </div>
            </div>
        </div>
    )
}

const LiveGame = (props) => {
    const [hover, setHover] = useState(false)
    return (
        <div className={classes.live + " " + classes.game}>
            <CustomIcon icon="live" style="live" />
            <span
                className="clickable"
                onClick={() => props.selectPlayer(props.game.playerA)}
            >
                {props.game.playerA.name}

            </span>
            vs
            <span
                className="clickable"
                onClick={() => props.selectPlayer(props.game.playerB)}
            >
                {props.game.playerB.name}

            </span>
        </div>
    )
}

export default Game
