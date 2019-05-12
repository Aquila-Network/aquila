module.exports = {
    // connect current peer to a list of peers
    connectNewNodeToPeers(peers, cbk) {
        console.log(peers)
        cbk (null, {peers:[3]})
    }
}