function distinctGroupedRows(head, req) {
    var distinctRecordMap = {};
    while (row = getRow()) {
        // Make sure we are only representing each relationship a single time.

        var parentId = doc.type === "term" ? doc.uniqueID : doc.aliasOf;

        if (!distinctRecordMap[parentId]) {

            distinctRecordMap[row.doc._id] = row;
        }
    }

    var keys = Object.keys(distinctRecordMap);
    var values = keys.map(function(v) { return distinctRecordMap[v]; });

    send(JSON.stringify(values, null, 2));
}