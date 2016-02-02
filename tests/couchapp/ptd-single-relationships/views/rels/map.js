function (doc) {
    if (doc.type === "relationship-single") {
        emit(doc.parent._id, { _id: doc.parent._id, aliases: [ doc.child ]});
    }
}