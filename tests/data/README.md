These are test data files for use in evaluating various strategies.  To install them, use CouchDB's bulk document API with the `curl` utility and a command like:

`for i in *.json; do curl -H "Content-Type: application/json" -d @$i -X POST http://admin:admin@localhost:5984/relationships/_bulk_docs; done`