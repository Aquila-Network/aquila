const Base64 = require('js-base64').Base64
const faiss_client = require('../faissclient')

module.exports = {
    getKNDocumentsToVec(k, matrix, cbk) {
        faiss_client.getKNN(k, matrix, cbk)
    }
}