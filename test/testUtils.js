/**
 * Created by Дмитрий on 19.11.2017.
 */
const dbInit = require('.//db_init');
const domain_uri = 'domain_uri_1';
const treeController = require('./../controllers/treeController');
const Node = require('./../model/gp_node').Node;

testTreeView = async function()
{
    await createData();
    let nodes = await Node.find({domain_uri:domain_uri});
    let [tree, isolated] = treeController.prepareTree(nodes);
    //assert(true);
    console.log(tree);
};

testTreeView();