function(doc) {
    if (doc.type === "relationship" && doc.members) {
        if (doc.parentId) {
            emit([doc.parentId, "parent"], { _id: doc.parentId })
        }
        for (var a = 0; a < doc.members.length; a++) {
            var memberId = doc.members[a];
            var key = doc.parentId ? [ doc.parentId, "child"] : [doc.key];
            emit(key, { _id: memberId });
        }
    }
}