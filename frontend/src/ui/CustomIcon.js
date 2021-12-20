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

import classes from "./CustomIcon.module.css"
const CustomIcon = (props) => {
    const icons = {
        tie: faBalanceScale,
        win: faTrophy,
        loss: faSkullCrossbones,
        ROCK: faHandRock,
        PAPER: faHandPaper,
        SCISSORS: faHandScissors,
        live: faSatelliteDish
    }
    const styles = {
        live: classes.live
    }

    return (
        <FontAwesomeIcon
            icon={icons[props.icon] ? icons[props.icon] : faQuestionCircle}
            className={styles[props.style] ? styles[props.style] : ""}
        />
    )
}
export default CustomIcon
