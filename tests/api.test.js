import chai, {expect} from "chai"
import chaiHttp from 'chai-http'
import {make_server} from '../src/server.js'

chai.use(chaiHttp)


function l() { console.log(... arguments) }

describe('live silly.io test',() => {
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
    it('should list the local dataset',async () => {
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
})
