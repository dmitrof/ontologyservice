const mongoose = require('mongoose');
const Node = require('./../model/gp_node').Node;
const Schema = mongoose.Schema;

const domainSchema =  new Schema( {
    uri : {type: String, required: true, unique: true},
    name : String,
    description : { type: String, default : "Unidentified domain"},
    published : {type: Boolean, default: false},
    created_at : {type: Date},
    updated_at : {type: Date}
} , {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}}, {collection : "items"});

domainSchema.methods = {
    removeTree: function() {
        return Promise.all([this.remove(),
            Node.remove({domain_uri: this.uri})
        ]);
    },
    savePublished: function() {
        this.published = true;
        return this.save();
    }
};

domainSchema.statics = {
    getByUri: function(uri) {
        return this.findOne({uri : uri}).exec();
    },

    getPublished: function() {
        return this.find({published: true}).limit(10);
    },

    saveAndPublish: function(uri, name, description)
    {
        return this.create(new Domain({
            uri: uri,
            name : name,
            description: description,
            pusblished: true
        }))
    }
};

const Domain = mongoose.model('domain', domainSchema);

module.exports.Domain = Domain;