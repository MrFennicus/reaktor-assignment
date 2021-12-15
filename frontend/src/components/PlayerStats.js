import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faPercent, faTrophy } from "@fortawesome/free-solid-svg-icons"
import classes from "./PlayerStats.module.css"
import * as webSocketRouter from "../store/webSocketRouter"

const PlayerStats = (props) => {
    const [mostPlayedHand, setMostPlayedHand] = useState(undefined)
    const [winRatio, setwinRatio] = useState(undefined)

   
    useEffect(() => {
        webSocketRouter.request(`players/${props.playerName}`, 
            async (data) => {
                setMostPlayedHand(data.playerStats.mostPlayedHand)
                setwinRatio(data.playerStats.winRatio)
            }
        )
    }, [props.playerName])

    return (
        <div className={classes.PlayerStats + " " + props.className}>
            <FontAwesomeIcon className = {classes.icon} icon={faStar} />: {mostPlayedHand}{" "}
            <FontAwesomeIcon className = {classes.icon} icon={faTrophy} />{" "}
            <FontAwesomeIcon className = {classes.icon} icon={faPercent} />:{" "}
            {winRatio ? (winRatio * 100).toFixed(1) : 0}
        </div>
    )
}

export default PlayerStats
