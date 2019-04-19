const btoa = require('btoa')

module.exports = {
    getKNDocumentsToVec(k, matrix, cbk) {
        // console.log(k, matrix)
        var db = __g__PDBs.documentsDB

        // call FAISS KNN
        var matrix_ = [{ e: [1.0, 2.2, 3.3, 4.4] }, { e: [1.0, 2.2, 3.3, 4.4] }]
        // get IDs = hashed vectors
        var IDs = ['123', '456']
        var counter = 0
        var docArray = []
        // retrieve documents with ID
        IDs.forEach((ID) => {
            db.get(ID, function(err, doc) {
                if (!err) {
                    docArray.push(doc)
                    counter ++
                }
                else {
                    console.log('error getting document')
                    docArray.push({})
                    counter ++
                }
                if (counter === IDs.length) {
                    cbk (null, { matrix: matrix_, documents: btoa(JSON.stringify(docArray)) })
                }
            })
        })
    }
}