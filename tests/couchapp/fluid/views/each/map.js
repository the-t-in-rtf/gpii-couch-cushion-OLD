function (doc) {
    var fluid = require("views/lib/");
    emit(doc._id, doc);
    //fluid.each([0,1,2], function(value){
    //    emit(doc.id, value);
    //});
}