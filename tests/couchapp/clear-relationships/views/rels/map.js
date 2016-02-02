function(doc) {
    if (doc.type.indexOf("relationship") === 0 || doc.deleted) {
        emit(doc._id, { _id: doc._id, _rev: doc._rev, _deleted: true});
    }
}