module.exports = {
    connectNewNodeToPeers(peers, cbk) {
        console.log(peers)
        cbk (null, {peers:[3]})
    }
}