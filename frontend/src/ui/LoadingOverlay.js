import classes from "./LoadingOverlay.module.css"

const LoadingOverlay = (props) => {
    return (
        <div
        className={props.active ? classes.loadingActive : classes.loading}
    />
    )
}

export default LoadingOverlay