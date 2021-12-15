import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faTrophy,
    faBalanceScale,
    faSkullCrossbones,
    faQuestionCircle,
    faSatelliteDish
} from "@fortawesome/free-solid-svg-icons"
import {
    faHandRock,
    faHandPaper,
    faHandScissors
} from "@fortawesome/free-regular-svg-icons"
import classes from "./Game.module.css"
import PlayerStats from "./PlayerStats"
import { useState } from "react"
import Time from "../ui/Time"

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

    const playerIcon =
        props.game.player.played === "ROCK"
            ? faHandRock
            : props.game.player.played === "PAPER"
            ? faHandPaper
            : faHandScissors
    const opponentIcon =
        props.game.opponent.played === "ROCK"
            ? faHandRock
            : props.game.opponent.played === "PAPER"
            ? faHandPaper
            : faHandScissors
    let className
    let description
    let resultIcon
    switch (props.game.result) {
        case "tie":
            className = classes.tie
            description = ` vs ${props.game.opponent.name}`
            resultIcon = faBalanceScale
            break
        case "win":
            className = classes.win
            description = ` vs ${props.game.opponent.name}`
            resultIcon = faTrophy
            break
        case "loss":
            className = classes.loss
            description = ` vs ${props.game.opponent.name}`
            resultIcon = faSkullCrossbones
            break
        default:
            className = classes.undetermined
            description = `Game vs ${props.game.opponent.name} with undetermined results`
            resultIcon = faQuestionCircle
    }

    return (
        <div className={className + " " + classes.game}>
            <div
                onClick={() => props.selectPlayer(props.game.player)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
            
                <FontAwesomeIcon
                    icon={resultIcon}
                    data-tip={props.game.result}
                />
                {description}{" "}
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
                        <FontAwesomeIcon icon={playerIcon} /> vs{" "}
                        <FontAwesomeIcon icon={opponentIcon} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const LiveGame = (props) => {
    return (
        <div className={classes.live + " " + classes.game}>
            <FontAwesomeIcon
                icon={faSatelliteDish}
                className={classes.liveIcon}
            />
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
