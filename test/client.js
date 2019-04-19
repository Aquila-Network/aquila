const grpc = require('grpc')
var protoLoader = require('@grpc/proto-loader')
const btoa = require('btoa')
const atob = require('atob')

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

vecdb.addDocuments({ documents: [{_id: '123', vector: { e: [1.02, 2.2, 3.3, 4.405] }, b64data: btoa(JSON.stringify({hello: 'world', hey: 'there'}))}, {_id: '456', vector: { e: [1.0, 2.2, 3.3, 4.3]}, b64data: btoa(JSON.stringify({hello: 'world', hey: 'there'})) }]}, (err, resp) => {
    console.log(resp)
    vecdb.deleteDocuments({ documents: [{_id: '201a4f637b03efc172d75cbeffa981bd', vector: { e: [1.0, 2.2, 3.3, 4.4]}}, {_id: 'eaac1225dac47f44598361394454a545', vector: { e: [1.0, 2.2, 3.3, 4.4]}}]}, (err, resp) => {
        console.log(resp)
        vecdb.getNearest({ k:3, matrix: [ { e: [1.0, 2.2, 3.3, 4.4]}, { e: [1.0, 2.2, 3.3, 4.4]} ] }, (err, resp) => {
            console.log(JSON.parse(atob(resp.documents)))
        })
    })
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