const express = require('express');
const router = express.Router();
const treeController = require('./../controllers/treeController');

/* GET home page. */
router.get('/', treeController.getTreeList);

/**
 * Routes for tree management
 */
router.get('/tree', treeController.getTree);

router.post('/tree/addDomain', treeController.addDomain);
router.post('/tree/removeDomain', treeController.removeDomain);
router.post('/tree/removeTree', treeController.removeTree);


module.exports = router;
