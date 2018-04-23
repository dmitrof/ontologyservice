const Domain = require('./../model/domain').Domain;
const Node = require('../model/gp_node').Node;
const mongoose = require('mongoose');
const NodeTypes = require('../model/gp_node').nodeTypes;
const assert = require('assert');
const treeController = require('./../controllers/treeController');

let mongoDB = 'mongodb://127.0.0.1:27017/ontologydb';
mongoose.connect(mongoDB, {
    useMongoClient: true
});

//Параметры автоматической генерации тестовых деревьев
//Кол-во прямых потомков каждой вершины
const branchingFactor = 2;
//Количество уровней (ярусов)
const nlevels = 3;
//Число изолированных вершин
const isolatedCount = 1;

createData = async function()
{
    const domainNum = 3;
    //flushing the database before initialization
    await flushDb();
    console.log("database cleaned");
    let domains = [];
    let mongoPromises = [];
    for (let i = 0; i < domainNum; i++) {
        let newDomain = new Domain({
            uri: 'domain_uri_'.concat(i),
            name: 'name_'.concat(i),
            description: 'desc_'.concat(i)
        });
        domains.push(newDomain);
        mongoPromises.push(newDomain.savePublished());
    }

    let nodes_count = domainNum * countNodes(0,  1, nlevels, branchingFactor) + domainNum * isolatedCount;

    for (let domain of domains)
    {
        const tree = generateTree(domain, nlevels, branchingFactor);
        const isolatedNodes = generateIsolatedNodes(domain.uri, isolatedCount);
        for (let node of tree)
        {
            mongoPromises.push(node.save());
        }
        for (let node of isolatedNodes)
        {
            mongoPromises.push(node.save());
        }
        mongoPromises.push(domain.savePublished());
    }

    await Promise.all(mongoPromises);
    //await assertAndFlush(() => getDomainsCount(3));
    await assertAndFlush(async () => {
        let nodes = await Node.find({});
        console.log('nodes count: ' + nodes.length);
        return nodes.length === nodes_count;
    });
    console.log("data added to database");


    var exampleTree = await Node.getSubTree('domain_uri_1');
    var exampleTreeRoot = {uri:'domain_uri_1', children:exampleTree};
    assert(checkTreeUniqueUris(exampleTreeRoot, true, '')[0]);
    exampleTree = treeController.unflattenTree(exampleTree);




    //console.log(domain_uri.concat(' is removed with all nodes'));
    console.log(exampleTree);
};

generateTree = function(domain, nlevels, branchingFactor)
{
    let allNodes = [];
    let treeLevel = [domain];
    for (let i = 1; i <= nlevels; i++)
    {
        treeLevel = generateTreeLevel(domain.uri, treeLevel, allNodes, i, branchingFactor);
    }
    return allNodes;
};

generateTreeLevel = function(domainUri, previousLevel, allNodes, levelNumber, branchingFactor)
{
    let tree_level = [];
    let index = 0;
    for (let parent of previousLevel)
    {
        for (let i = 1; i <= branchingFactor; i++)
        {
            let node_uri = parent.uri.concat('_').concat(i);
            let node = constructNode(node_uri, domainUri);
            node.parent_uri = parent.uri;
            node.prereq_uris = getRandomPrereqs(allNodes, 3);
            tree_level.push(node);
            allNodes.push(node);
        }
    }
    return tree_level;
};

generateIsolatedNodes = function(domainUri, n)
{
    let nodes = [];
    for (let i = 1; i <= n; i++)
    {
        let node_uri = domainUri.concat('_isolated_').concat(i);
        let node = constructNode(node_uri, domainUri);
        nodes.push(node);
    }
    return nodes;
};

getRandomPrereqs = function(nodes, n)
{
    let prereqs = [];
    let prereqNum = Math.floor(Math.random() * n);
    for (let i = 0; i < Math.min(prereqNum, nodes.length); i++)
    {
        prereqs.push(nodes[Math.floor(Math.random() * nodes.length)].uri);
    }
    return prereqs;
};


constructNode = function(uri, domain_uri)
{
   return new Node({
       uri: uri,
       name: uri.concat('_name'),
       domain_uri: domain_uri
   });
};

/**
 * Executing a check and if it fails - flushes the database
 */
assertAndFlush = async function(supplier) {
    let result = await supplier();
    if (!result)
    {
        flushDb();
    }
    assert(result)
};

checkTreeUniqueUris = function(treeNode, boolAcc, uriAcc)
{
    boolAcc = boolAcc && !uriAcc.includes(treeNode.uri);
    if (uriAcc.includes(treeNode.uri))
        console.log('duplicated ' + treeNode.uri);
    uriAcc = uriAcc.concat(treeNode.uri);
    if (treeNode.children)
        for (let childrenNode of treeNode.children)
            [boolAcc, uriAcc] = checkTreeUniqueUris(childrenNode, boolAcc, uriAcc);
    return [boolAcc, uriAcc];
};

flushDb = function()
{
    return Promise.all([Domain.remove({}), Node.remove({})]);
};

getDomainsCount = async function(count)
{
    let domainList = await Domain.getPublished();
    return domainList.length === count;
};

module.exports.createData = createData;

countNodes = function(acc, level, nlevels,  branchingFactor)
{
    acc += Math.pow(branchingFactor, level);
    return level !== nlevels ? countNodes(acc, level + 1, nlevels,  branchingFactor) : acc;
};

//console.log(countNodes(0, 1, 4, 2));


createData();
