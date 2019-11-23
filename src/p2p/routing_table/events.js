const replicator = require("../replicator");

const pdb = __g__PDBs.swarmDB;

// all event handlers as an object
const e_ = {
  error: function(err) {
    console.log(err);
  },
  changedDoc: function(change) {
    // handle change
    if (change.deleted) {
      // handle peer deleted event
      pdb
        .get(change.doc._id)
        .then(function(doc) {
          // handle doc
          console.log(doc);
        })
        .catch(function(err) {
          console.log(err);
        });
    } else {
      // handle peer added event
      replicator.init_replication(
        change.doc.url,
        __g__vDBConfig.couchDB.DBInstance + "_docsdb",
        change.doc._id
      );
    }
  }
};

// all event settings
const s_ = {
  changeDoc: {
    since: "now",
    live: true,
    include_docs: true
  }
};

module.exports = {
  // register events
  registerEvents() {
    // register change event
    var changes = pdb
      .changes(s_.changeDoc)
      .on("change", e_.changedDoc)
      .on("error", e_.error);
  }
};
