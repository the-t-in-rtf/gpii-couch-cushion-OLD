function (doc) {
    if (doc.type === "relationship-multi") {
        var relationship = { _id: doc.parent._id, aliases: doc.children}

        // Emit a single copy indexed using the parent's uniqueId
        emit(doc.parent.uniqueId, relationship);

        // Emit another copy for every child record...
        for (var a=0; a < doc.children.length; a++) {
            emit(doc.children[a].uniqueId, relationship);
        }
    }
}