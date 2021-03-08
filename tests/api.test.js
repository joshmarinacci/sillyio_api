import chai, {expect} from "chai"
import chaiHttp from 'chai-http'
import {make_server} from '../src/server.js'

chai.use(chaiHttp)


function l() { console.log(... arguments) }

describe('live silly.io test',() => {
    it('should list the local status',async () => {
        let server = make_server()
        await chai.request(server)
            .get('/')
            .then(res=>{
                l("START: body is",res.body)
                expect(res.status).to.equal(200)
                expect(res.body).to.deep.equal({'status':'ok'})
            })
        l("done with listing")
    })
    it('should list the datasets', async () => {
        let server = await make_server()
        await chai.request(server).get('/api/lists').then(res=>{
                expect(res.status).to.equal(200)
                expect(res.body.length).to.equal(6)
            })
        l("done with listing")

        await chai.request(server).get('/api/list/alphabet').then(res => {
            // l("json body is",res.body)
            expect(res.status).to.eq(200)
            expect(res.body.data.items.length).to.eq(26)
        })
        l("done with alphabet")
    })
})

describe('live tests', () => {
    it('should get the status page',  (done) => {
        chai.request('https://api.silly.io')
            .get('/')
            .end((err,res)=>{
                expect(res.status).to.equal(200)
                // res.body.should.be({'status':'ok'})
                done()
            })
    })
    it('should list the datasets', async () => {
        //start the task
        await chai.request('https://api.silly.io')
            .get('/api/lists')
            .then(res=>{
                console.log("START: body is",res.body)
                expect(res.status).to.equal(200)
                expect(res).to.have.header('content-type','application/json')
            })
        l("done with listing")
    })
})