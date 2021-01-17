//load input json
//go to main object
//for every obj, project selected fields
//output final json to output.json


import {promises as fs} from 'fs'
import * as PATH from "path"
import assert from 'assert'
import {parse, isValid} from 'date-fns'


async function doit(options) {
    let input = await fs.readFile(options.input)
    input = JSON.parse(input)
    let start = input
    if(options.start) start = input[options.start]
    start = start.filter(item => {
        if(item.status.current === 'completed') return true
        return false
    })

    let count= 0
    let output = start.map(item => {
        let outem = {}
        Object.entries(options.fields).forEach(field => {
            let [in_name,out_name] = field
            // console.log("checking",in_name.split("."))
            let parts = in_name.split('.')
            let value = item
            parts.forEach(part => {
                value = value[part]
            })
            // console.log("final value",value)
            outem[out_name] = value
        })
        // count++
        // if(count > 100) throw new Error()
        return outem
    })
    // console.log(output)
    await fs.writeFile(options.output,JSON.stringify(output,null,"    "))
}

doit({
    input: 'scratch.json',
    output: 'output.json',
    fields:{
        "name":'name',
        "statistics.floors above":'floors',
        "statistics.height":'height',
        "statistics.rank":'rank',
        "status.completed.year":'completed_date'
        // "population":"population",
        // number:"number",
        // atomic_mass:'weight',
        // symbol:'symbol',
        // "discovered_by":"discovered_by",
        // "source":"provenance"
    }
}).then(()=>console.log("done")).catch(e => console.error(e))
