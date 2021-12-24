import { StandardWebSocketClient } from "./deps.js"

import { Router } from "./src/router.js"

let port = 8080
if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1]
    port = Number(lastArgument)
}
const router = new Router(port)
console.log(`serving on ${port}`)




