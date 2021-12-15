const webSocket = new WebSocket("wss://reaktor-assignment-backend.herokuapp.com")
let handlers = {} // keeps track of how to handle responses to each request
let requests = [] // buffer for requests, used if the requests can't be made right away

webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.requestId in handlers) {
        handlers[data.requestId](data)
    }
}

// make the buffered requests when a connection is established
webSocket.onopen = () => {
    for (const [message, handler, id] of requests) {
        request(message, handler, id)
    }
    requests = []
}

// doesn't affect security, Math.random() suffices
const generateRandomId = (max) => {
    return Math.floor(Math.random() * max)
}

export const setHnadler = (responseHandler, id) => {
    // if id is not given, generate a random id
    const requestId = id ? id : generateRandomId(4294967295) //2^32-1
    handlers[requestId] = responseHandler
    return requestId
}

// send a request to the server
export const request = async (message, responseHandler, id) => {
    if (webSocket.readyState !== 1)
        requests.push([message, responseHandler, id])
    else {
        const requestId = setHnadler(responseHandler, id)
        webSocket.send(JSON.stringify({ message: message, id: requestId }))
        console.log(message)
    }
}