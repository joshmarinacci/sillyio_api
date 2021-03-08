const {make_server} = require('./server.js')
let PORT = 30065
let app = make_server()
app.listen(PORT, () => {
    console.log(`started silly.io server on port ${PORT}`)
})
