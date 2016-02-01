function(doc) {
    if (doc.type === "relationship" && doc.members) {
        if (doc.parentId) {
            emit(doc.parentId, { _id: doc.parentId })
        }
        for (var a = 0; a < doc.members.length; a++) {
            var memberId = doc.members[a];
            emit(doc.parentId || doc.key, { _id: memberId });
        }
    }
}