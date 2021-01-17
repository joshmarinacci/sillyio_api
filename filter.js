import {promises as fs} from 'fs'
import * as PATH from "path"
import assert from 'assert'
import {parse, isValid} from 'date-fns'
import neatCsv from 'neat-csv'

function print_usage() {
    console.log("filter <filename>")
}

async function process_file(input) {
    let bytes = await fs.readFile(input)
    let data = JSON.parse(bytes.toString())
    console.log("item count", data.items.length)
    let items = data.items.sort((a,b)=>{
        return a.height - b.height
    })
    items = items.reverse()
    items = items.slice(0,50)
    console.log(items)
}

async function process_csv(input) {
    let bytes = await fs.readFile(input)
    let csv_data = await neatCsv(bytes.toString())
    console.log("parsed", csv_data)
    let data = csv_data.map(datum => {
        return {
            rank:parseInt(datum.rank),
            name:datum.name.trim(),
            city:datum.city.trim(),
            country:datum.country.trim(),
            height:parseFloat(datum['Height m']),
            floors: parseInt(datum.floors),
            year: parseInt(datum.year)
        }
    })
    data = data.slice(0,20)
    console.log(data)
    await fs.writeFile('output.json',JSON.stringify(data,null,'    '))
}

function doit() {
    if(process.argv.length < 3) return print_usage()
    let input = process.argv[2]
    if(input.endsWith('csv')) return process_csv(input).then(()=>console.log("done"))
    process_file(input).then(()=>console.log("done"))
}

doit()