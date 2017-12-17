const helper = require('./../controllers/controllerHelper');
const Node = require('./../model/gp_node').Node;
const Domain = require('./../model/domain').Domain;

module.exports.addNode = async function (req, res) {
    try {
        if (helper.checkParam(req.body.domain_uri))
        {
            let node = new Node(gatherNodeData(req));
            await node.checkDataAndSave();
            res.json({success:true, message:"node saved"})
        }
        else
        {
            res.json({message: 'domain_uri was not specified', success: false});
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
};

module.exports.removeNode = async function (req, res) {
    try {
        await Node.remove({uri : req.body.node_uri});
        res.json({message: 'node removed!', success: true});
    }
    catch (err) {
        res.status(500).send(err);
    }

};


module.exports.updateNode = async function(req, res) {
    try {
        let newNodeData = gatherNodeData(req);
        console.log("PARENT_URI" + newNodeData.parent_uri);
        await Node.findOneAndUpdate({uri: req.body.uri}, {$set: newNodeData}, {upsert: true}, (doc, err) => {});
        if (helper.checkParam(req.body.domain_uri))
        {
            res.json({message: 'node updated!!', success: true});
        }
        else
        {
            res.redirect('/api/tree');
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
};

module.exports.getNodeParent = async function(req, res)
{
    let node_uri = req.params.node_uri;
    let parentNode;
    let node = await Node.findOne({uri: node_uri});
    if (node.parent_uri)
    {
        if (!node.isRoot())
            parentNode = await Node.find({uri: node.parent_uri});
        else
            parentNode = await Domain.find({uri: node.parent_uri});
        res.json({message: 'node parent fetched', success: true, result: parentNode[0]});
    }
    else
    {
        res.json({message: 'node has no parents', success: false});
    }
};

module.exports.getPrereqs = async function(req,res)
{
    let node_uri = req.params.node_uri;
    let node = await Node.findOne({uri: node_uri});
    let prereqs = await Node.find({uri: {$in: node.prereq_uris}});
    res.json({message: 'node prereqs are fetched', success: true, result: prereqs});
};

module.exports.getDependants = async function(req, res) {
    try {
        let node_uri = req.params.node_uri;
        if (!helper.checkParam(req.params.domain_uri))
            domain_uri = (await Node.findOne({uri: node_uri})).domain_uri;
        let dependantNodes = await Node.find({domain_uri: domain_uri, prereq_uris: {$all: [node_uri]}});
        res.json({message: 'node for which' + node_uri +'is prereq are fetched', success: true, result: dependantNodes});
    }
    catch (err) {
        res.status(500).send(err);
    }

};

gatherNodeData = function(req)
{
    /*let data = req.body.node;*/

    let data = {
        uri : req.body.uri,
        name : req.body.name,
        description : req.body.description,
        domain_uri : req.body.domain_uri,
        parent_uri : req.body.parent_uri,
        prereq_uris : req.body.prereq_uris
    };

    return helper.updateQueryParams(data);

};