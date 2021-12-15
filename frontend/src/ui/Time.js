import classes from "./Time.module.css"

const Time = (props) => {
    const now = new Date()
    const time = new Date(props.time)
    let content
    if(now.getDate() !== time.getDate()) content = `${time.getDay() + 1}.${time.getMonth()}.${time.getFullYear()}`
    else content = `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`
    return (
            <span className={classes.Time}>{content}</span>
    )
}

export default Time