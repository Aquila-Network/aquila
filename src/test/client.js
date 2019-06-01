const grpc = require('grpc')
var protoLoader = require('@grpc/proto-loader')
const btoa = require('btoa')
const atob = require('atob')
const njs = require('numjs')

var itercnt = 1
var rawcnt = 4


var PROTO_PATH = __dirname + '/../proto/vecdb.proto'
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    })

const proto = grpc.loadPackageDefinition(packageDefinition)

var vecdb = new proto.vecdb.VecdbService('localhost:50051',
                grpc.credentials.createInsecure())

for (let i=0; i<itercnt; i ++) {
    setTimeout(function(){ 
        run()
        console.log('tick..')
    }, i*1000)
}

setTimeout (function(){
    finish()
}, (itercnt+1)*1000)

function finish(){
    var train_matrix = njs.random([rawcnt,8]).tolist()
    console.log(train_matrix[0])
    console.log('FINISHING...')
    vecdb.getNearest({ k:20, matrix: [ { e: train_matrix[0]}, { e: train_matrix[1]} ] }, (err, resp) => {
        console.log(JSON.parse(atob(resp.documents)))
    })
}

function run() {
    var train_matrix = njs.random([rawcnt,8])
    train_matrix = train_matrix.tolist()
    var docs_gen = []
    for(let i=0;i<train_matrix.length;i++) {
        docs_gen.push({
            //_id: ''+i+Math.floor((Math.random() * 10000) + 1), 
            vector: { e: train_matrix[i] }, 
            b64data: btoa(JSON.stringify({hello: 'world', hey: 'there'}))
        })
    }

    // console.log(docs_gen)

    vecdb.addDocuments({ documents: docs_gen}, (err, resp) => {
        console.log(resp._id.length)
        // vecdb.deleteDocuments({ documents: [{_id: '201a4f637b03efc172d75cbeffa981bd', vector: { e: [1.0, 2.2, 3.3, 4.4]}}, {_id: 'eaac1225dac47f44598361394454a545', vector: { e: [1.0, 2.2, 3.3, 4.4]}}]}, (err, resp) => {
        //     console.log(resp)
            // vecdb.getNearest({ k:3, matrix: [ { e: train_matrix[0]}, { e: train_matrix[1]} ] }, (err, resp) => {
            //     console.log(JSON.parse(atob(resp.documents)))
            // })
        // })
    })

    // vecdb.deleteDocuments({ documents: [{_id: '201a4f637b03efc172d75cbeffa981bd', vector: { e: [1.0, 2.2, 3.3, 4.4]}}, {_id: '1234', vector: { e: [1.0, 2.2, 3.3, 4.4]}}]}, (err, resp) => {
    //     console.log(resp)
    // })

    // vecdb.addNode({ peers: ['peer1 IP', 'peer2 IP'] }, (err, resp) => {
    //     console.log(resp)
    // })

    // vecdb.getNearest({ k:3, matrix: [ { e: [1.0, 2.2, 3.3, 4.4]}, { e: [1.0, 2.2, 3.3, 4.4]} ] }, (err, resp) => {
    //     console.log(resp)
    // })
}