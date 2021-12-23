import classes from "./Time.module.css"

const Time = (props) => {
    const now = new Date()
    const time = new Date(props.time)
    let content = "" 
    const today = now.toDateString() === time.toDateString()
    if(!today) content = `${time.getDate() }.${time.getMonth() +1}.${time.getFullYear()}`
    content += ` ${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`
    return (
            <span className={`${classes.Time} ${props.className}`}>{content}</span>
    )
}

export default Time