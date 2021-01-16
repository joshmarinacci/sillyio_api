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

    let output = start.map(item => {
        let outem = {}
        Object.entries(options.fields).forEach(field => {
            let [in_name,out_name] = field
            outem[out_name] = item[in_name]
        })
        return outem
    })
    // console.log(output)
    await fs.writeFile(options.output,JSON.stringify(output,null,"    "))
}

doit({
    input: 'datasets/worldpopulation.json',
    output: 'output.json',
    fields:{
        "country":'name',
        "population":"population",
        // number:"number",
        // atomic_mass:'weight',
        // symbol:'symbol',
        // "discovered_by":"discovered_by",
        // "source":"provenance"
    }
}).then(()=>console.log("done"))
