import { StandardWebSocketClient } from "./deps.js"

import { Router } from "./src/router.js"

let port = 8080
if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1]
    port = Number(lastArgument)
}
let apiAddress = "https://bad-api-assignment.reaktor.com"
const router = new Router(port, apiAddress)
console.log(`serving on ${port}`)




