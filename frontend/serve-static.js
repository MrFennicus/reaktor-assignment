import { Application } from "https://deno.land/x/oak/mod.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.4/mod.ts";

const app = new Application();

app.use(staticFiles("build"));

let port = 3000
if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1]
    port = Number(lastArgument)
}

console.log(`serving on ${port}`)
await app.listen({ port: port });