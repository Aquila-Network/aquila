const fetch = require('node-fetch')
const routing_table_limit = 10
const routing_table_get_location = '/peers-table'
const peer_secret = 'machi machoo'
const req_timeout = 5000
const random_peer_selection_probability = 0.5

async function ping_and_cleanup_ (routing_table, cbk) {
    var pdb = __g__PDBs.swarmDB

    for(let i=0;i<routing_table.length;i++) {
        var url_ = routing_table[i].doc.url
        var secret_ = routing_table[i].doc.secret
        var id_ = routing_table[i].doc._id
        var rev_ = routing_table[i].doc._rev
        
        // try pinging each peer
        await fetch(url_,
            {
                method: 'post',
                body:    JSON.stringify({secret: peer_secret}),
                headers: { 'Content-Type': 'application/json' },
                timeout: req_timeout
            })
            .then(res => res.text())
            .then((body) => {
                if (body === secret_) {
                    // keep item
                }
                else {
                    // remove item
                    return pdb.remove(routing_table[i].doc)
                }
            })
            .catch((err) => {
                // remove item
                console.log(err)
                // remove item
                return pdb.remove(routing_table[i].doc)
            })
    }
    cbk()
}

async function routing_table_update_ (routing_table, cbk) {
    // check if routing table limit approached
    if (routing_table.length <= routing_table_limit) {
        var remaining_positions = routing_table_limit - routing_table.length
        for(let i=0;i<routing_table.length;i++) {
            // check if a position remaining
            if (remaining_positions > 0) {
                var url_ = routing_table[i].doc.url
                var secret_ = routing_table[i].doc.secret
                var id_ = routing_table[i].doc._id
                var rev_ = routing_table[i].doc._rev
                
                // try fetching routing table
                await fetch(url_+routing_table_get_location,
                    {
                        method: 'post',
                        body:    JSON.stringify({secret: peer_secret}),
                        headers: { 'Content-Type': 'application/json' },
                        timeout: req_timeout
                    })
                    .then(res => res.json())
                    .then((body) => {
                        // loop over table, verify each url is not already
                        // in routing table, then add it to swarm db
                        for (let i=0;i<body.length;i++) {
                            // genarate a random number under range(item length)
                            // if it matches certain threashold, then only execute below
                            // actions. This is to ensure random distribution of peers
                            var rno_ = Math.floor(Math.random()*body.length) 
                            console.log(rno_, (body.length - 1) * random_peer_selection_probability)
                            // if current random draw is not favourable
                            if (rno_ > (body.length - 1) * random_peer_selection_probability) {
                                // skip execution below
                                continue
                            }
                            console.log('no skip')
                            // check if a position remaining
                            if (remaining_positions > 0) {
                                var pdb = __g__PDBs.swarmDB
                                var url_ = body[i].url
                                var secret_ = body[i].secret
                                pdb.find({
                                    selector: {url: {$eq: url_}},
                                    fields: ['_id']
                                }).then(function (result) {
                                    // add this url to routing table if not exists already
                                    if(result.docs.length == 0) {
                                        // add url & secret
                                        pdb.put({
                                            url: url_,
                                            secret: secret_
                                        })
                                        // adjust remaining positions
                                        remaining_positions --
                                    }
                                }).catch(function (err) {
                                    // nothing, just continue
                                })
                            }
                            else{
                                // no position remains, exit loop
                                break
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
            else {
                // no position remains, exit loop
                break
            }
        }
        cbk()
    }
    else {
        cbk()
    }
}

module.exports = {
    // do ping and cleanup of routing table
    ping_and_cleanup (cbk) {
        var pdb = __g__PDBs.swarmDB
        // get all entries in routing table
        pdb.allDocs({
            include_docs: true
        }, function (err, result) {
            ping_and_cleanup_(result.rows, cbk)
        })
    },
    // update with new peers
    update_with_new (cbk) {
        var pdb = __g__PDBs.swarmDB
        // get all entries in routing table
        pdb.allDocs({
            include_docs: true
        }, function (err, result) {
            routing_table_update_(result.rows, cbk)
        })
    },
    get_peer_table (cbk) {
        var pdb = __g__PDBs.swarmDB
        // get all entries in routing table
        pdb.allDocs({
            include_docs: true
        }, function (err, result) {
            if (!err) {
                ret = []
                for (let i=0;i<result.total_rows;i++) {
                    ret.push({url: result.rows[i].doc.url, secret: result.rows[i].doc.secret})
                }
                cbk(err, ret)
            }
            else {
                cbk(err, result)
            }
        })
    }
}