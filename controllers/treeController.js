const Domain = require('./../model/domain').Domain;
const GraphNode = require('./../model/gp_node').Node;
const helper = require('./../controllers/controllerHelper');

/**
 * Загрузка страницы с графом
 */
getAllNodes = async function (domain_uri) {
    return Promise.all([
        Domain.getByUri(domain_uri),
        GraphNode.getAllNodes(domain_uri)
    ]);
};

module.exports.getTree = async function(req, res)
{
    let domain_uri = req.params.domain_uri;
    if (!helper.checkParam(domain_uri)) {
        console.log('domain_uri not specified');
        getTreeList(req, res);
        return;
    }
    try {
        let [domain, flattenedTree, domainNodes] = await Promise.all([
            Domain.findOne({uri: domain_uri}),
            GraphNode.getSubTree(domain_uri),
            GraphNode.find({domain_uri: domain_uri})
        ]);
        let redirectMessage = req.params.redirectMessage;
        let [tree, isolated] = unflattenTree(flattenedTree, domainNodes);
        //let tree = flattenedTree;
        let res_data = {
            success: true,
            message : redirectMessage ? redirectMessage : null,
            domain : domain,
            tree : tree,
            isolated: isolated
        };
        console.log(domain);
        res.json(res_data);
    }
    catch (err) {
        res.status(500).send(err);
    }
};

getSubTree = async function(req, res) {
    let rootUri = req.params.subtree_rooturi;
    let subTree = unflattenTree(await GraphNode.getSubTree(rootUri));

    res.json({success:true, message : 'subtree ' + rootUri + ' is fetched', subTree : subTree});
};

module.exports.getSubTree = getSubTree;

getTreeList = async function(req, res) {
    try {
        let domainList = await Domain.getPublished();
        res.json({domains: domainList});
    }
    catch (err) {
        res.status(500).send(err);
    }
};


module.exports.getTreeList = getTreeList;

module.exports.addDomain = async function(req, res)
{
    let newDomain = new Domain(gatherDomainData(req));
    await newDomain.saveAndPublish(newDomain);
    res.json({message: 'domain created!', success: true});
};

module.exports.editDomain = async function(req, res)
{
    try {
        let newDomainData = gatherDomainData(req);
        await Domain.findOneAndUpdate({uri: req.body.uri}, {$set: newDomainData}, {upsert: true}, (doc, err) => {});
        res.json({message: 'domain updated!', success: true});
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

module.exports.removeDomain = async function(req, res)
{
    await Domain.remove({uri: req.body.uri});
    res.redirect('/api');
};

module.exports.removeTree = async function(req, res)
{
    await Domain.removeTree(req.body.domainUri);
    res.json({message: 'domain ' + req.body.domainUri + ' is deleted'});
};

//todo rework (here we can calculate isolated nodes)
unflattenTree = function(flattenedTree, domainNodes)
{
    let nodesMap = {};
    let nodes = [];
    let roots = [];
    for (let root of flattenedTree)
    {
        for (let node of root.children)
        {
            nodesMap[node.uri] = node;
            nodes.push(node);
        }
        root.children = [];
        nodesMap[root.uri] = root;
        roots.push(root);
    }
    for (let node of nodes)
    {
        if (helper.checkParam(node.parent_uri) && nodesMap.hasOwnProperty(node.parent_uri)) {
            nodesMap[node.parent_uri].children.push(node);
        }
    }

    Array.prototype.diff = function(a) {
        return this.filter((node) => !a.hasOwnProperty(node.uri));
    };

    let isolated = domainNodes.diff(nodesMap);
    return [roots, isolated];
};

module.exports.unflattenTree = unflattenTree;

gatherDomainData = function(req)
{
    let data = {
        uri : req.body.uri,
        name : req.body.name,
        description : req.body.description,
        author : "admin",
    };

    return helper.updateQueryParams(data);
};