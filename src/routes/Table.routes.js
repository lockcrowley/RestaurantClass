const router = require('express').Router();

const TableController = require('../controllers/Table.controller.js');

router.post('/create', TableController.createTable);

router.get('/', TableController.getTables);

module.exports = router;