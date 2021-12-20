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
        <div className={className + " " + classes.game}>
            <div
                onClick={() => props.selectPlayer(props.game.player)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <CustomIcon icon={props.game.result} /> vs{" "}
                {props.game.opponent.name}
                <PlayerStats
                    playerName={props.game.opponent.name}
                    className={hover ? classes.tooltip : classes.hidden}
                    iconsClassName={classes.tooltipIcon}
                />
            </div>
            <div>
                <div className={classes.infoBox}>
                    <Time time={props.game.time} />
                    <div>
                        <CustomIcon icon={props.game.player.played} /> vs{" "}
                        <CustomIcon icon={props.game.opponent.played} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const LiveGame = (props) => {
    return (
        <div className={classes.live + " " + classes.game}>
            <CustomIcon icon="live" style="live" />
            <button onClick={() => props.selectPlayer(props.game.playerA)}>
                {props.game.playerA.name}
            </button>
            vs
            <button onClick={() => props.selectPlayer(props.game.playerB)}>
                {props.game.playerB.name}
            </button>
        </div>
    )
}

export default Game
