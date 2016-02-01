function (head, req) {
    var groupedJSON = {};
    while (row = getRow()) {
        if (row._id === row.key) {
            if (groupedJSON[row.key] && groupedJSON[row.key].members) {
                row.doc.members = groupedJSON[row.key].members;
            }

            groupedJSON[row.key] = row.doc;
        }
        else {
            if (!groupedJSON[row.key]) {
                groupedJSON[row.key] = {};
            }

            if (!groupedJSON[row.key].members) {
                groupedJSON[row.key].members = [];
            }

            groupedJSON[row.key].members.push(row.doc);
        }
    }

    send(JSON.stringify(groupedJSON, null, 2));
}