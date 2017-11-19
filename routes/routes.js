const express = require('express');
const router = express.Router();
const treeController = require('./../controllers/treeController');
const nodeController = require('./../controllers/nodeController');

/* GET home page. */
router.get('/', treeController.getTreeList);

/**
 * Routes for tree management
 */
router.route('/trees')
    .get(treeController.getTreeList)
    .post(treeController.addDomain);

router.route('/trees/:domain_uri')
    .get(treeController.getTree)
    .post(treeController.editDomain)
    .delete(treeController.removeDomain);

router.post('/tree/addDomain', treeController.addDomain);
router.post('/tree/removeDomain', treeController.removeDomain);
router.post('/tree/removeTree', treeController.removeTree);
router.post('/tree/editDomain', treeController.editDomain);

/**
 * Routes for node management
 */
router.post('/node/add', nodeController.addNode);
router.post('/node/remove', nodeController.removeNode);
router.post('/node/update', nodeController.updateNode);

module.exports = router;
