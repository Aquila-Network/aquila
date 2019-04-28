const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const btoa = require('btoa')
const atob = require('atob')
const utils = require('../../utils')

var PROTO_PATH = __dirname + '/../../proto/faiss.proto'
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    })

const proto = grpc.loadPackageDefinition(packageDefinition)

var faissRPC = new proto.faiss.FaissService('localhost:50052',
                grpc.credentials.createInsecure())

function proto_matrix_transform (matrix_in) {
    var ret = []

    for (let r=0; r<matrix_in.length; r++) {
        var raw = matrix_in[r]
        ret.push({e: raw})
    }
    return ret
}

function initFaiss(nlist, nprobe, bpv, bpsv, vd, cbk) {
    var db = __g__PDBs.documentsDB
    utils.bulkGetVectors(db, (err, train_matrix) => {
        console.log(train_matrix.length, ' documents retrieved for faiss index training')
        if(!err) {
            var faiss_init_data = {
                "nlist": nlist,
                "nprobe": nprobe,
                "bpv": bpv,
                "bpsv": bpsv,
                "vd": vd,
                "matrix": proto_matrix_transform (train_matrix)
            }
        
            faissRPC.initFaiss(faiss_init_data, cbk)
        }
        else {
            cbk (err, null)
        }
    })
}

function mapVecDocId (doc_id, vec_id, cbk) {
    // get & increment document count locally in DB
    var mdb = __g__PDBs.mapperDB
    utils.mapDoc2VecID(mdb, doc_id, vec_id, (err) => {
        if (!err) {
            utils.mapVec2DocID(mdb, doc_id, vec_id, (err) => {
                if (!err) {
                    // success mapping done
                    cbk (null)
                }
                else {
                    // failed mapping
                    cbk (err)
                }
            })
        }
        else {
            cbk (err)
        }
    })
}

function getVecId (cbk) {
    // get & increment document count locally in DB
    utils.getVecID((err, counter_) => {
        if (!err) {
            cbk (null, counter_)
        }
        else {
            console.log(err)
            cbk(err, null)
        }
    })
}

function addToFaiss(new_matrix, cbk) {
    var init_config = __g__vDBConfig.faiss.init
    // TBD: train index only once
    initFaiss(init_config.nlist, init_config.nprobe, init_config.bpv, init_config.bpsv, init_config.vd, cbk)
    // TBD: add new matrix to faiss
}
                
module.exports = {
    // add a new vector to faiss db
    addNewVector (r_times, doc_id, new_matrix) {
        // check if the document is fresh (new doc id)
        if (r_times === '1') {
            console.log('Document with id: ' + doc_id + ' is fresh!')
        }
        getVecId((err, vec_id) => {
            console.log(vec_id)
            if (!err) {
                mapVecDocId (doc_id, vec_id, (err) => {
                    if(!err) {
                        if (vec_id > 10000) {
                            addToFaiss(new_matrix, (err, resp) => {
                                console.log('Added vectors', err, resp)
                            })    
                        }
                        else {
                            console.log('Atleast 10000 training data is needed.')
                        }
                    }
                })
            }
        })    
    }
}