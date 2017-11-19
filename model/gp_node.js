const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const helper = require('./../controllers/controllerHelper');

const nodeTypes = {
    ROOT: 'root',
    DEFAULT: 'interim',
    LEAVE: 'leave'
};

module.exports.nodeTypes = nodeTypes;

const nodeSchema = new Schema({
    uri : {type: String, required: true, unique: true},
    name : String,
    description : {
        type: String, default : "Undescribed node"
    },
    node_type: {
        type: String,
        enum : [nodeTypes.ROOT, nodeTypes.DEFAULT, nodeTypes.LEAVE],
        default : nodeTypes.DEFAULT
    },
    domain_uri : {
        type: String,
        required: true
    },
    parent_uri : {
        type: String
    },
    prereq_uris :[{
        type: String
    }],
    created_at : {type: Date},
    updated_at : {type: Date},
} , {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}},
    {collection : "items"});


nodeSchema.methods = {
    checkPrereqs: async function(prereq_uris)
    {
        let found_prereqs = await Node.find({uri : {$in : prereq_uris}});
        for (let prereq of found_prereqs)
        {
            this.prereq_uris.push(prereq);
        }
    },

    checkDataAndSave: async function()
    {
        let [found_prereqs, found_parent] = await Promise.all([
            Node.find({uri : {$in : this.prereq_uris}}),
            Node.find({uri : {$in : this.parent}})
        ]);

        if (helper.checkParam(this.parent_uri) && !helper.checkParam(found_parent))
        {
            throw new Error('specified parent_uri' + parent_uri + 'does not exist');
        }

        for (let prereq of found_prereqs)
        {
            this.prereq_uris.push(prereq);
        }
        return this.save();
    },


    addPrereqsAndSave: async function(prereq_uris)
    {
        this.prereq_uris = prereq_uris;
        return this.save();
    },

    //todo test
    addAndSavePrereq: function(prereq_uri)
    {
        if (!prereqnode instanceof Node)
        {
            //todo throw something
        }
        else
        {
            Node.create(prereq_uri)
                .then(saved_prereq => this.prereq_uris.push(saved_prereq.uri));
            console.log("prereq node created");
        }
    },

    setExistingParent: async function(parent_uri)
    {
        let parent = await Node.findOne({uri: parent_uri});
        if (parent && parent !==undefined)
        {
            this.parent_uri = parent_uri;
        }
        else {
            throw new Error('Specified parent_uri  ' + parent_uri + 'does not exist!')
        }
    },

    setParentAndSave: function(parent_uri) {
        return this.setExistingParent(parent_uri).then(success => this.save());
    },

    setDomain: function(domain_uri) {
      this.domain_uri = domain_uri;
      return this.save();
    },

    //todo more precice check needed
    isLeave: function() {
        return this.node_type === nodeTypes.LEAVE
    },

    isRoot: function() {
        return this.node_type === nodeTypes.ROOT
    },

    isIsolated: function()
    {
        return !this.isRoot() && !this.hasOwnProperty('parent')
    },
    /*addNodeWithDomain: function(domainUri) {
        newDomain = new Domain( {
            uri : domainUri,
        });
        newDomain.save();
        return this.save();
    }*/
};


nodeSchema.statics = {
    getByUri: function(uri)
    {
        return this.findOne({uri:uri})
            .exec();
    },


    /**
     * Fetch all the tree matching the domain name
     */
    getTree: function(domain_uri) {
        return this.find({domain_uri: domain_uri})
            .exec()
    },


    /**
     * Fetch first n tiers of a tree
     */
    getTreeLimited: function(domain_uri) {
        return this.find({domain_uri: domain_uri});
    },

};

const Node = mongoose.model('Node', nodeSchema);

module.exports.Node = Node;

//todo: methods
