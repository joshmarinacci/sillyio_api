/*
for every dataset
check parse error
check schema missing
check properties missing or empty or count = 0
check each property has name and type
check items missing
check each item has every property
if property is number, check can parse
if property is string, check not empty, warn not error
if property is date, check not empty, check can parse, warn

 */

import {promises as fs} from 'fs'
import * as PATH from "path"

async function validate_dataset(file) {
    let bytes = await fs.readFile(file)
    console.log("read", file)
    let json = JSON.parse(bytes.toString())
    // console.log(json)
}

async function validate_dir(datasets) {
    let files = await fs.readdir(datasets)
    console.log(files)
    files.filter(str => str.endsWith('.json')).forEach(str => {
        validate_dataset(PATH.join(datasets,str))
    })
}

validate_dir('datasets').then(()=>console.log("done"))