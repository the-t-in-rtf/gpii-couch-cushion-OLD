// A script to generate relationship documents based on existing Preference Terms Dictionary data.  We are testing
// an approach which requires linking by CouchDB ID, so this script:
//
// 1. Looks up the UID and ID for all parent records using a URL like: http://localhost:5984/ptd/_design/api/_view/terms
// 2. Looks up all aliases using a URL like: http://localhost:5984/ptd/_design/api/_view/aliases
// 3. Creates a term IDs and alias IDs.
// 4. Creates 2 JSON documents that can be used with CouchDB's bulk document API.  One has a relationship document for each alias, the other has one per term.
// 5. Outputs instructions to assist in loading data.
//
// To use this script, you must have installed the legacy PTD CouchDB API views found in:
//
// https://github.com/the-t-in-rtf/ptd-api/tree/CTR-158/src/couchapp/api
//
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

var gpii  = fluid.registerNamespace("gpii");

require("kettle");

var os   = require("os");
var path = require("path");
var fs   = require("fs");

fluid.registerNamespace("gpii.couchdb.cushion.tests.ptd");

// Build a map of term UIDs and IDs
gpii.couchdb.cushion.tests.ptd.storeTerms = function (that, data) {
    fluid.each(data.rows, function(termRecord) {
        that.termMap[termRecord.value.uniqueId] = termRecord.id;
    });

    that.events.termsStored.fire();
};

// Build a map of alias CouchDB IDs and term UIDs.
gpii.couchdb.cushion.tests.ptd.storeAliases = function (that, data) {
    fluid.each(data.rows, function(aliasRecord) {
        var uniqueId = aliasRecord.value.aliasOf;
        if (!that.aliasMap[uniqueId]) {
            that.aliasMap[uniqueId] = [];
        }
        that.aliasMap[uniqueId].push({ _id: aliasRecord.id, uniqueId: aliasRecord.value.uniqueId });
    });

    that.events.aliasesStored.fire();
};

// Generate two sets of relationship documents.  One in which each term has an array of aliases, the other in which
// each alias<->term relationship has a separate document.
//
gpii.couchdb.cushion.tests.ptd.generateRelationships = function (that) {
    var singleRelationshipDocs = [];
    var multiRelationshipDocs  = [];

    fluid.each(that.aliasMap, function (aliases, termUid) {
        var termId = that.termMap[termUid];
        if (termId) {
            var parentRecord = { _id: termId, uniqueId: termUid};
            multiRelationshipDocs.push({ type: "relationship-multi", parent: parentRecord, children: aliases});
            fluid.each(aliases, function (alias) {
                singleRelationshipDocs.push({ type: "relationship-single", parent: parentRecord, child: alias});
            });
        }
        else {
            fluid.log("Skipping invalid UID '" + termUid + "'...");
        }
    });

    var timestamp = Date.now();

    var singleFileName = "ptd-relationships-single-" + timestamp + ".json";
    gpii.couchdb.cushion.tests.ptd.saveOutput(singleFileName, { docs: singleRelationshipDocs });

    var multiFilename = "ptd-relationships-multi-" + timestamp + ".json";
    gpii.couchdb.cushion.tests.ptd.saveOutput(multiFilename, { docs: multiRelationshipDocs });


    fluid.log("Finished generating relationship data...\n\n");

    fluid.log("To load the dataset with one relationship per file, use commands like:\n");
    fluid.log("cd " + os.tmpdir() + "; curl -d @" + singleFileName + " -H 'Content-Type: application/json' -X POST http://admin:admin@localhost:5984/ptd/_bulk_docs\n\n");

    fluid.log("To load the dataset with multiple relationships per file, use commands like:\n");
    fluid.log("cd " + os.tmpdir() + "; curl -d @" + multiFilename + " -H 'Content-Type: application/json' -X POST http://admin:admin@localhost:5984/ptd/_bulk_docs\n\n");
};

gpii.couchdb.cushion.tests.ptd.saveOutput = function(filename, data) {
    var filePath = path.resolve(os.tmpdir(), filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

fluid.defaults("gpii.couchdb.cushion.tests.ptd.relationshipGenerator", {
    gradeNames: ["fluid.component"],
    events: {
        aliasesStored: null,
        termsStored:   null,
        onAllDataStored: {
            events: {
                aliasesStored: "aliasesStored",
                termsStored:   "termsStored"
            }
        }
    },
    members: {
        termMap:  {}, // termUid: termId
        aliasMap: {}  // aliasId: termUid
    },
    components: {
        termReader: {
            type: "kettle.dataSource.URL",
            options: {
                url: "http://localhost:5984/ptd/_design/api/_view/terms",
                listeners: {
                    "onRead.storeTerms": {
                        func: "{relationshipGenerator}.storeTerms"
                    }
                }
            }
        },
        aliasReader: {
            type: "kettle.dataSource.URL",
            options: {
                url: "http://localhost:5984/ptd/_design/api/_view/aliases",
                listeners: {
                    "onRead.storeAliases": {
                        func: "{relationshipGenerator}.storeAliases"
                    }
                }
            }
        }
    },
    invokers: {
        storeTerms: {
            funcName: "gpii.couchdb.cushion.tests.ptd.storeTerms",
            args:      ["{that}", "{arguments}.0"]
        },
        storeAliases: {
            funcName: "gpii.couchdb.cushion.tests.ptd.storeAliases",
            args:      ["{that}", "{arguments}.0"]
        }
    },
    listeners: {
        "onCreate.readTerms": {
            func: "{termReader}.get"
        },
        "onCreate.readAliases": {
            func: "{aliasReader}.get"
        },
        "onAllDataStored.generateRelationships": {
            funcName: "gpii.couchdb.cushion.tests.ptd.generateRelationships",
            args:     ["{that}"]
        }
    }
});

gpii.couchdb.cushion.tests.ptd.relationshipGenerator();

