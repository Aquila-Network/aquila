const hchange = require('./change')

// all event handlers as an object
const e_ = {
    error: function (err) {
        console.log(err)
    },
    changedDoc: function(change) {
        // handle change
        hchange.handle(change)
    }
}

// all event settings
const s_ = {
    changeDoc: {
        since: 'now',
        live: true,
        include_docs: true
    }
}

module.exports = {
    // register events
    registerEvents() {
        var db = __g__PDBs.documentsDB
        // register change event
        var changes = db.changes(s_.changeDoc).on('change', e_.changedDoc).on('error', e_.error)
    }
}