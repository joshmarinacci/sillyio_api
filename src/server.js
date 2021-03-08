import cors from 'cors'
import express from "express"
import bodyParser from 'body-parser'
import path from 'path'
import {promises as fs} from 'fs'
import {JSONCache} from './cache.js'

let DATASETS_DIR = "datasets"

let OLD_IDS = {
    'edae2a56-9c96-4533-8bd6-df01e8c8f116': 'alphabet.json',
    '9eccf847-8e4c-437f-a538-dfa4943de679': 'states.json',
}


export async function make_server() {
    let app = express()
    app.use(cors())
    app.use(bodyParser.json({limit: '50mb'}));

    function convert_id(id) {
        if (OLD_IDS[id]) return OLD_IDS[id]
        return id + ".json"
    }

    function log(...args) {
        console.log("LOG:", ...args)
    }


    let cache = new JSONCache(DATASETS_DIR)
    await cache.init()

    app.get('/api/list/:id', (req, res) => cache.get_by_id(convert_id(req.params.id)).then(data => res.json({
        data: data,
        schema: {}
    })))
    app.get('/api/list/:id/table', (req, res) => res.sendFile('table.html', {root: process.cwd()}))
    app.get('/api/list/:id/filter', (req, res) => cache.get_by_id(convert_id(req.params.id)).then(data => res.json(data)))
    app.get('/api/lists/',(req,res) => cache.get_keys().then(data=>res.json(data)))
    app.get('/', (req, res) => res.json({status: "ok"}))

    return app
}

//https://api.silly.io/api/list/edae2a56-9c96-4533-8bd6-df01e8c8f116/table?list=edae2a56-9c96-4533-8bd6-df01e8c8f116&fields=letter,name,syllables&order=letter

//https://api.silly.io/api/list/edae2a56-9c96-4533-8bd6-df01e8c8f116/table?list=edae2a56-9c96-4533-8bd6-df01e8c8f116&fields=letter,name,syllables&order=letter

//https://api.silly.io/api/list/9eccf847-8e4c-437f-a538-dfa4943de679/table?list=9eccf847-8e4c-437f-a538-dfa4943de679&fields=abbreviation,capital,name,nickname,statehood_date&order=abbreviation