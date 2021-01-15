import cors from 'cors'
import express from "express"
import bodyParser from 'body-parser'
import path from 'path'
import {promises as fs} from 'fs'


let app = express()
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));

let PORT = 30065
let DATASETS_DIR = "datasets"

let OLD_IDS = {
    'edae2a56-9c96-4533-8bd6-df01e8c8f116':'alphabet.json'
}
function convert_id(id) {
    if(OLD_IDS[id]) return OLD_IDS[id]
    return id
}

function log(...args) {
    console.log("LOG:",...args)
}

async function fetch_raw_list(id) {
    let pth = path.join(DATASETS_DIR, 'alphabet.json')
    log("reading from path",pth)
    let str = await fs.readFile(pth)
    // log("read the raw data",str)
    let json = JSON.parse(str)
    log("parsed",json)
    return json
}

app.get('/api/list/:id',(req,res) => fetch_raw_list(convert_id(req.params.id)).then(data => res.json({data:data, schema:{}})))
app.get('/api/list/:id/table',(req,res) => res.sendFile('table.html', {root:process.cwd()}))
app.get('/api/list/:id/filter',(req,res) => fetch_raw_list(convert_id(req.params.id)).then(data => res.json(data)))
app.get('/',(req,res)=> res.json({ status:"ok" }))

app.listen(PORT,()=>{
    console.log(`started silly.io server on port ${PORT}`)
})


//https://api.silly.io/api/list/edae2a56-9c96-4533-8bd6-df01e8c8f116/table?list=edae2a56-9c96-4533-8bd6-df01e8c8f116&fields=letter,name,syllables&order=letter

//https://api.silly.io/api/list/edae2a56-9c96-4533-8bd6-df01e8c8f116/table?list=edae2a56-9c96-4533-8bd6-df01e8c8f116&fields=letter,name,syllables&order=letter