const Domain = require('./../model/domain').Domain;
const Node = require('../model/gp_node').Node;
const mongoose = require('mongoose');
const NodeTypes = require('../model/gp_node').nodeTypes;
const assert = require('assert');

let mongoDB = 'mongodb://127.0.0.1:27017/ontologydb';
mongoose.connect(mongoDB, {
    useMongoClient: true
});

createData = async function()
{
    const domain_uri = 'domain_uri_1';
    let domain = await Domain.getByUri(domain_uri);
    const root_uri = 'root_uri_1';
    //flushing the database before initialization
    await flushDb();
    console.log("database cleaned");

    let domainAddPromises = [];
    for (let i = 0; i < 3; i++) {
        let newDomain = new Domain({
            uri: 'domain_uri_'.concat(i),
            name: 'name_'.concat(i),
            description: 'desc_'.concat(i)
        });
        domainAddPromises.push(newDomain.savePublished());
    }

    await Promise.all(domainAddPromises);

    await assertAndFlush(() => getDomainsCount(3));

    console.log("domains added to database");

    let root = getRootNode(root_uri, domain_uri);
    await Node.create(root);

    let node1 = getNode('node1', domain_uri);
    await node1.setParent(root_uri);
    await Node.create(node1);

    let node2 = getNode('node2', domain_uri);
    await node2.setParent('node1');
    await Node.create(node2);
    console.log((await Node.findOne({uri: 'node2'})).parent_node);

    let node3 = getNode('node3', domain_uri);
    await node3.setParent('node2');
    await Node.create(node3);
    let oldParentNodeId = (await Node.findOne({uri: 'node3'})).parent_node;

    await (await Node.findOne({uri: 'node3'})).setParentAndSave('node2');

    let newParentNodeId = (await Node.findOne({uri: 'node3'})).parent_node;

    assert.notEqual(oldParentNodeId, newParentNodeId);

    node3 = await Node.findOne({uri: 'node3'});

    await node3.addPrereqsAndSave(['node2', 'node1']);
    console.log(" is isolated: " + node1.isIsolated());

    let populated = await Node.getByUri('node3');
    console.log(populated.prereqs);

    (await Domain.getByUri(domain_uri)).removeTree();

    //Node.remove({domain_uri:"domain_uri_1"});

    console.log(domain_uri.concat(' is removed with all nodes'));

};



getNode = function(uri, domain_uri)
{
   return new Node({
       uri: uri,
       name: uri.concat('name'),
       domain_uri: domain_uri
   });
};

getRootNode = function(uri, domain_uri)
{
    return new Node({
        uri: uri,
        name: uri.concat('name'),
        domain_uri: domain_uri,
        node_type: NodeTypes.ROOT
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

flushDb = function()
{
    return Promise.all([Domain.remove({}), Node.remove({})]);
};

getDomainsCount = async function(count)
{
    let domainList = await Domain.getPublished();
    return domainList.length === count;
};


createData();


