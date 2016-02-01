Demonstrates how you can use relationship documents and a simple view to retrieve grouped records.

To install this view, use a command like:

`couchapp push http://admin:admin@localhost:5984/relationships`

To view the raw map output, open the view URL, as in :

http://localhost:5984/relationships/_design/reldoc/_view/include_docs

To see the view output with document content, use the following URL:

http://localhost:5984/relationships/_design/reldoc/_view/include_docs?include_docs=true

To group the view output using the custom list, use the following URL:

http://localhost:5984/relationships/_design/reldoc/_list/grouped-list/include_docs?include_docs=true

To retrieve one or more groups by their ID, use a URL like:

http://localhost:5984/relationships/_design/reldoc/_list/grouped-list/include_docs?include_docs=true&keys=[%22parent-1%22,%22group-e%22]

