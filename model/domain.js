const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const domainSchema =  new Schema( {
    uri : {type: String, required: true, unique: true},
    name : String,
    description : { type: String, default : "Unidentified domain"},
    created_at : {type: Date},
    updated_at : {type: Date},
} , {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}}, {collection : "items"});

domainSchema.methods = {
    removeWithNodes: function(uri, name, description) {

    },


};


module.exports = mongoose.model('domain', domainSchema);
//todo: methods