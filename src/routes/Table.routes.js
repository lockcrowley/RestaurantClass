const router = require('express').Router();

const TableController = require('../controllers/Table.controller.js');

router.post('/create', TableController.createTable);

router.get('/', TableController.getTables);

router.put('/update/:id', TableController.updateTableStatus);

router.delete('/delete/:id', TableController.deleteTable);

module.exports = router;