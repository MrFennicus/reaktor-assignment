let webSocket
let handlers = {} // keeps track of how to handle responses to each request
let requests = [] // buffer for requests, used if the requests can't be made right away

export const init = () => {
    // if already initialized, no need to do anything
    if (!webSocket) {
        webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKETSERVER)
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
    }
}

// doesn't affect security, Math.random() suffices
const generateRandomId = (max) => {
    return Math.floor(Math.random() * max)
}

export const setHandler = (responseHandler, id) => {
    // if id is not given, generate a random id
    const requestId = id ? id : generateRandomId(4294967295) //2^32-1
    handlers[requestId] = responseHandler
    return requestId
}

// send a request to the server if the web socket is ready, otherwise buffer it
export const request = async (message, responseHandler, id) => {
    if (!webSocket || webSocket.readyState !== 1)
        requests.push([message, responseHandler, id])
    else {
        const requestId = setHandler(responseHandler, id)
        webSocket.send(JSON.stringify({ message: message, id: requestId }))
    }
}
