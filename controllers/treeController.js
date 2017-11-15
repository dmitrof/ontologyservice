const Domain = require('./../model/domain').Domain;
const GraphNode = require('./../model/gp_node').Node;
const helper = require('./../controllers/controllerHelper');

//todo нормальная обработка некорректных параметров (в мидлварь?)
/**
 * Загрузка страницы с графом
 */
module.exports.getTree = async function (req, res) {
    let domain_uri = req.query.domain_uri;

    if ((!domain_uri) || (domain_uri === undefined)) {
        console.log('domain_uri not specified');
        getTreeList(req, res);
        return;
    }

    try {
        let [domain, nodes] = await Promise.all([
            Domain.getByUri(domain_uri),
            GraphNode.getTree(domain_uri)
        ]);
        let res_data = {
            domain : domain,
            nodes : nodes
        };

        res.json(res_data);
    }
    catch (err) {
        res.status(500).send(err);
    }
};

getTreeList = async function(req, res) {
    try {
        let domainList = await Domain.getPublished();
        res.json(domainList);
    }
    catch (err) {
        res.status(500).send(err);
    }
};

module.exports.getTreeList = getTreeList;

module.exports.addDomain = async function(req, res)
{
    await Domain.saveAndPublish(req.body.uri, req.body.name, req.body.description);
    res.redirect('/api/tree?domain_uri='.concat(req.body.uri));
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