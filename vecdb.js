const grpc = require('grpc')
var protoLoader = require('@grpc/proto-loader')
const atob = require('atob')

// global variable, accessible from anywhere
global.__g__iPDB = require('pouchdb')
// Initialize pouchDB by connecting to local instance of couchDB with default databases
global.__g__PDBs = {
    documentsDB: new __g__iPDB('http://localhost:5984/docsdb'), // to keep all documents stored (synced on user request)
    mapperDB: new __g__iPDB('http://localhost:5984/mapperdb'), // to keep vecID - docID mappings (not synced)
    swarmDB: new __g__iPDB('http://localhost:5984/swarmdb') // to keep swarm & peers data (synced by default with all nodes)
}

// core utilities
const documentUtil = require('./core/document')
const searchUtil = require('./core/search')
const swarmUtil = require('./core/swarm')

var PROTO_PATH = __dirname + '/proto/vecdb.proto'
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    })

const proto = grpc.loadPackageDefinition(packageDefinition)
const server = new grpc.Server()

server.addService(proto.vecdb.VecdbService.service, {
    addDocuments(call, callback) {
        var documents = call.request.documents
        
        documentUtil.addOrModify(documents, (err, resp) => {
            if (!err) {
                callback (null, { status: true, _id: resp._id })
            }
            else {
                console.log('Error while adding document.')
                callback (null, { status: false, _id: null })
            }
        })
    },
    deleteDocuments(call, callback) {
        var documents = call.request.documents
        
        documentUtil.delete(documents, (err, resp) => {
            if (!err) {
                callback (null, { status: true, _id: resp._id })
            }
            else {
                console.log('Error while deleting document.')
                callback (null, { status: false, _id: null })
            }
        })
    },
    addNode(call, callback) {
        var peers = call.request.peers
        
        swarmUtil.connectNewNodeToPeers(peers, (err, resp) => {
            if (!err) {
                callback (null, { status: true, peers: resp.peers})
            }
            else {
                console.log('Error while adding node to swarm.')
                callback (null, { status: false, peers: null })
            }
        })
    },
    getNearest(call, callback) {
        var k = call.request.k
        var vector = call.request.matrix
        
        searchUtil.getKNDocumentsToVec(k, vector, (err, resp) => {
            if (!err) {
                callback (null, { status: true, matrix: resp.matrix, documents: resp.documents })
            }
            else {
                console.log('Error while getting KNND.')
                callback (null, { status: false, matrix: null, documents: null })
            }
        })
    }
})

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure())
server.start()
