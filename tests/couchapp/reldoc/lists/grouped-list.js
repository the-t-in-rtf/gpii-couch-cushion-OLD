function (head, req) {
    var groupedJSON = {};
    while (row = getRow()) {
        var parentId = row.key[0];
        if (row.key[1] === "parent") {
            if (groupedJSON[parentId] && groupedJSON[parentId].members) {
                row.doc.members = groupedJSON[parentId].members;
            }

            groupedJSON[parentId] = row.doc;
        }
        else {
            if (!groupedJSON[parentId]) {
                groupedJSON[parentId] = {};
            }

            if (!groupedJSON[parentId].members) {
                groupedJSON[parentId].members = [];
            }

            groupedJSON[parentId].members.push(row.doc);
        }
    }

    send(JSON.stringify(groupedJSON, null, 2));
}