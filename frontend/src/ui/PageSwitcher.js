import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faAngleLeft,
    faAngleDoubleLeft,
    faAngleRight,
    faAngleDoubleRight
} from "@fortawesome/free-solid-svg-icons"
import classes from "./PageSwitcher.module.css"

const PageSwitcher = (props) => {
    return (
        <div className={classes.PageSwitcher}>
            <div>
                {props.page} / {props.pageCount}
            </div>
            <button onClick={props.pageDownDown}>
                <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </button>
            <button onClick={props.pageDown}>
                <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button onClick={props.pageUp}>
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button onClick={props.pageUpUp}>
                <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
            {props.children}
        </div>
    )
}

export default PageSwitcher
