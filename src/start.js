import {make_server} from './server.js'

let PORT = 30065
let app = await make_server()
app.listen(PORT, () => {
    console.log(`started silly.io server on port ${PORT}`)
})
