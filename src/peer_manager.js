var express = require('express')
var bodyParser = require('body-parser')

var app = express()
// parse application/json
app.use(bodyParser.json())

const peer_manager_interval = 7000
const server_port = 50053
const peer_secret = 'machi machoo'

yaml = require('js-yaml')
fs   = require('fs')

// global variable, accessible from anywhere
// vecdb configuration
global.__g__vDBConfig = yaml.safeLoad(fs.readFileSync('./DB_config.yml', 'utf8'))
// pouchdb instance
global.__g__iPDB = require('pouchdb')
__g__iPDB.plugin(require('pouchdb-find'))
// Initialize pouchDB by connecting to local instance of couchDB with default databases
global.__g__PDBs = {
    swarmDB: new __g__iPDB(__g__vDBConfig.couchDB.host + '/' + __g__vDBConfig.couchDB.DBInstance + '_swarmdb'), // to keep swarm & peers data (not synced)
}

const p2p_rtable = require('./p2p/routing_table')

// ping peers and cleanup `routing table`
function ping_and_cleanup_routing_table (cbk) {
    p2p_rtable.ping_and_cleanup(cbk)
}

// get new peers to keep `routing table` full
function update_routing_table_with_new (cbk) {
    p2p_rtable.update_with_new(cbk)
}

// peer manager main function
function manager_fn() {
    // ping peers and cleanup `routing table`
    ping_and_cleanup_routing_table(() => {
        // get new peers to keep `routing table` full
        update_routing_table_with_new(() => {
            // nothing!
            console.log('-')
        })
    })
}

// each peer has got a secret. A ping request will be served with its peer secret.
app.get('/', function (req, res) {
    res.send('vecdb peer is up')
})

// this endpoint is to let other peers know this peer is alive.
// each peer has got a secret. A ping request will be served with its peer secret.
app.post('/', function (req, res) {
    if (req.body.secret === peer_secret) {
        res.send(peer_secret)
    }
    else {
        console.log('unauthorized')
        res.sendStatus(401)
    }
})

app.post('/peers-table', function (req, res) {
    if (req.body.secret === peer_secret) {
        p2p_rtable.get_peer_table((err, data) => {
            if (!err) {
                res.send(data)
            }
            else {
                res.sendStatus(403)
            }
        })
    }
    else {
        console.log('unauthorized')
        res.sendStatus(401)
    }
})

// set peer manager timer
setInterval(manager_fn, peer_manager_interval)

// start server
app.listen(server_port, () => console.log(`Example app listening on port ${server_port}!`))