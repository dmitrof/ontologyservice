const helper = require('./../controllers/controllerHelper');
const Node = require('./../model/gp_node').Node;

module.exports.addNode = async function (req, res) {
    let node = new Node(gatherNodeData(req));
    try {
        await node.checkDataAndSave();
        if (helper.checkParam(req.body.domain_uri))
        {
            res.redirect('/api/tree?domain_uri=' + req.body.domain_uri);
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

module.exports.removeNode = async function (req, res) {
    try {
        await Node.remove({uri : req.body.node_uri})
    }
    catch (err) {
        res.status(500).send(err);
    }
    res.redirect('/api/tree?domain_uri=' + domain_uri);
};


module.exports.updateNode = async function(req, res) {
    try {
        let newNodeData = gatherNodeData(req);
        await Node.findOneAndUpdate({uri: req.body.node_uri}, {$set: newNodeData}, {upsert: true}, (doc, err) => {});
        if (helper.checkParam(req.body.domain_uri))
        {
            res.redirect('/api/tree?domain_uri=' + req.body.domain_uri);
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

gatherNodeData = function(req)
{
    /*let data = req.body.node;*/

    let data = {
        uri : req.body.node_uri,
        name : req.body.node_name,
        description : req.body.node_description,
        domain_uri : req.body.domain_uri,
        parent_uri : req.body.prereq_uris,
        prereq_uris : req.body.prereq_uris
    };

    return helper.updateQueryParams(data);
};