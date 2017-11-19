const Domain = require('./../model/domain').Domain;
const GraphNode = require('./../model/gp_node').Node;
const helper = require('./../controllers/controllerHelper');

//todo нормальная обработка некорректных параметров (в мидлварь?)
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
        let [domain, nodes] = await getAllNodes(domain_uri);
        let [tree, isolated] = prepareTree(nodes);
        let res_data = {
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
    //if (helper.checkParam()
    try {
        let newDomainData = gatherDomainData(req);
        await Domain.findOneAndUdate({uri: req.body.domain_uri}, {$set: newDomainData}, {upsert: true}, (doc, err) => {});
        res.json({message: 'domain updated!', success: true});
    }
    catch (err) {
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
    await Domain.removeTree(req.body.uri);
    res.redirect('/api');
};

prepareTree = function(nodes)
{
    const nodesMap = nodes.reduce((map, node) => {
        map[node.uri] = node;
        return map;
    }, {});

    const isolated = [];
    const tree = nodes.filter(node => (node.isRoot()));

    for (let node of nodes) {
        if (helper.checkParam(node.parent_uri)) {
            if (nodesMap.hasOwnProperty(node.parent_uri)) {
                nodesMap[node.parent_uri].children = node;
            }
            else {
                isolated.push(node);
            }
        }
        else if (!node.isRoot())
        {
            isolated.push(node);
        }

    }
    return [tree, isolated];
};

module.exports.prepareTree = prepareTree;

gatherDomainData = function(req)
{
    let data = {
        uri : req.body.uri,
        name : req.body.name,
        description : req.body.description,
        author : "admin",
    };

    return helper.updateQueryParams(data);
}