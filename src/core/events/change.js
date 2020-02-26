const faiss_client = require("../faissclient");

module.exports = {
  // handle change event
  // TBD: now it treats only one document is changed at a time.
  // if multiple documents are changed at a time, logic here should
  // be chabged.
  handle(change) {
    for (let i = 0; i < change.changes.length; i++) {
      // get the number of times the same document is updated.
      var r_times = change.changes[i].rev.split("-")[0];
      var id = change.doc._id;
      var vector = change.doc.vector;
      faiss_client.addNewVector(r_times, id, vector);
    }
  }
};
