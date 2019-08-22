const faiss_client = require('../faissclient')

module.exports = {
    getKNDocumentsToVec(k, matrix, cbk) {
        faiss_client.getKNN(k, matrix, cbk)
    }
}