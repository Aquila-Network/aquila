const source_ = "http://localhost"
const pdb = __g__PDBs.replicationDB
const target_db_url_tail = ':5984/'+__g__vDBConfig.couchDB.DBInstance+'_docsdb'

module.exports = {
    // initialize replication
    init_replication (target, db_, rdb_id) {
        var rep = __g__iPDB.sync(db_, target+target_db_url_tail, {
            live: true,
            retry: true
        }).on('active', function () {
            // new changes replicating, user went back online
            
        }).on('error', function (err) {
            // handle error
            console.log(err)
        })
    },
    // end replication
    end_replication (target, db_, rdb_id) {

    }
}