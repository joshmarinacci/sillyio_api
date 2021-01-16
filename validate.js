/*
// check each item has every property
// if property is number, check can parse
if property is string, check not empty, warn not error
if property is date, check not empty, check can parse, warn

 */

import {promises as fs} from 'fs'
import * as PATH from "path"
import assert from 'assert'
import {parse, isValid} from 'date-fns'

async function validate_dataset(file) {
    let bytes = await fs.readFile(file)
    console.log("validating",file)
    let json = JSON.parse(bytes.toString())
    assert(json,'json missing')
    assert(json.schema,'schema missing')
    assert(json.schema.properties,'schema properties missing')
    assert(Object.keys(json.schema.properties).length>0,`${file} schema.properties empty`)

    let props = Object.entries(json.schema.properties)
    props.forEach(prop => {
        assert(prop[1].title,`${file} prop ${prop[0]} missing title`)
        assert(prop[1].type,`${file} prop ${prop[0]} missing type`)
    })

    assert(json.items,`${file} items missing`)
    json.items.forEach(item => {
        props.forEach(prop => {
            let [name, def] = prop
            let value = item[name]
            assert(value,`${file} item ${JSON.stringify(item)} missing prop ${name}`)
            if(def.type === 'number') {
                assert(Number.parseFloat(item[name]),`${file} item ${JSON.stringify(item)} couldn't parse value of ${value}`)
            }
            if(def.type === 'date') {
                // if property is date, check not empty, check can parse, warn
                let now = new Date()
                let parsed = parse(value,def.format,now)
                assert(isValid(parsed),`date isn't valid: ${value} by format ${def.format}`)
            }
        })
    })
}

async function validate_dir(datasets) {
    let files = await fs.readdir(datasets)
    console.log(files)
    files.filter(str => str.endsWith('.json')).forEach(str => {
        validate_dataset(PATH.join(datasets,str))
    })
}

validate_dir('datasets').then(()=>console.log("done"))