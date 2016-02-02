function(head, req) {
    var rows = [];
    while (row = getRow()) {
        rows.push(row.value);
    }

    send(JSON.stringify({ docs: rows }, null, 2))
}