const mongoose = require('mongoose');
const Node = require('./../model/gp_node').Node;
const Schema = mongoose.Schema;

const domainSchema =  new Schema( {
    uri : {type: String, required: true, unique: true},
    name : String,
    description : { type: String, default : "Unidentified domain"},
    published : {type: Boolean, default: false},
    created_at : {type: Date},
    author : {
        type: String,
        required: true,
        default: "unknown author"
    },
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
    },

    saveAndPublish: function(props)
    {
        props.published = true;
        return this.save(props);
    }
};

domainSchema.statics = {
    removeTree: function(domain_uri) {
        return Promise.all([
            Domain.remove({uri:domain_uri}),
            Node.remove({domain_uri: this.uri})
        ]);
    },

    getByUri: function(uri) {
        return this.findOne({uri : uri}).exec();
    },

    getPublished: function() {
        return this.find({published: true}).limit(10);
    },
};

const Domain = mongoose.model('domain', domainSchema);

module.exports.Domain = Domain;