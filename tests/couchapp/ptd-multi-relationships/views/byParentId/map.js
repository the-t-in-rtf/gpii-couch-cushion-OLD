function (doc) {
    if (doc.type === "relationship-multi") {
        emit(doc.parent.Id, { _id: doc.parent._id, aliases: doc.children.map(function(childRecord){ return { _id: childRecord._id} })});
    }
}