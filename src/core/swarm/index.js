const crypto = require('crypto')

async function add_to_routing_table(peers, cbk) {
    var ret_peers = []

    var pdb = __g__PDBs.swarmDB
    for (let i=0;i<peers.length;i++) {
        var split_ = peers[i].split('|')
        var url_ = split_[0]
        var secret_ = split_[1]
        _id = crypto.createHash('md5').update(JSON.stringify(url_+secret_)).digest('hex')
        // add url and secret
        await pdb.get(_id).then(function(doc) {
            return pdb.put({
                _id: _id,
                _rev: doc._rev,
                url: url_,
                secret: secret_
            })
        }).then(function (response) {
            // handle response
            ret_peers.push(split_[0])
        }).catch(async function (err) {
            if (err.status === 404) {
                await pdb.put({
                    _id: _id,
                    url: url_,
                    secret: secret_
                }).then(function (response) {
                    ret_peers.push(split_[0])
                })
            }
            else {
                console.log(err)
            }
        })
    }
    
    cbk (null, {peers: ret_peers})
}

module.exports = {
    // connect current peer to a list of peers
    connectNewNodeToPeers(peers, cbk) {
        add_to_routing_table(peers, cbk)
    }
}