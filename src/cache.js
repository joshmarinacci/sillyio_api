import path from 'path'
import {promises as fs} from 'fs'


function l() { console.log(... arguments) }

export class JSONCache {
    constructor(dir) {
        this._cached = {}
        this.dir = dir
    }

    async init() {
        let dirs = await fs.readdir(this.dir)
        return Promise.all(dirs.map(async(file) => {
            let id = path.basename(file,'.json')
            let pth = path.join(this.dir, file)
            l(`reading file ${pth} to ${id}`)
            let str = await fs.readFile(pth)
            try {
                this._cached[file] = JSON.parse(str.toString())
            } catch (e) {
                l(`error happened ${e}`)
                l("read the raw data",str.toString())
            }
        }))
    }

    async get_by_id(id) {
        if(this._cached[id]) return this._cached[id]
        return Promise.resolve(null)
    }

    async get_keys() {
        return Object.keys(this._cached)
    }
}
