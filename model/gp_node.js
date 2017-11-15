const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
        type: String, default : "Unidentified domain"
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
    parent_node : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node'
    },
    prereqs :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node'
    }],
    created_at : {type: Date},
    updated_at : {type: Date},
} , {timestamps : { createdAt : 'created_at', updatedAt : 'updated_at'}},
    {collection : "items"});


nodeSchema.methods = {
    addPrereqsByUri: async function(prereq_uris)
    {
        let found_prereqs = await Node.find({uri : {$in : prereq_uris}});

        for (let prereq of found_prereqs) {
            this.prereqs.push(prereq.id);
        }
    },

    addPrereqsAndSave: async function(prereq_uris)
    {
        await this.addPrereqsByUri(prereq_uris);
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
                .then(saved_prereq => this.addPrereqByUri(saved_prereq.uri));
            console.log("prereq node created");
        }
    },

    setParent: async function(parent_uri)
    {
        let parent = await Node.findOne({uri: parent_uri});
        this.parent_node = parent.id;
    },

    setParentAndSave: function(parent_uri) {
        this.setParent(parent_uri).then(success => this.save());
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
        return Node.findOne({uri:uri})
            .populate('parent_node')
            .populate('prereqs')
            .exec();
    },


    /**
     * Fetch all the tree matching the domain name
     */
    getTree: domain_uri => this.find({domain_uri: domain_uri})
        .populate('prereqs')
    ,

    /**
     * Fetch first n tiers of a tree
     */
    getTreeLimited: function(domain_uri) {
        return this.find({domain_uri: domain_uri})
            .populate('prereqs');
    }

};

const Node = mongoose.model('Node', nodeSchema);

module.exports.Node = Node;

//todo: methods
