const TableService = require('../services/Table.service.js');

class TableController {
  async createTable(req, res) {
    try {
      const tableCreated = await TableService.create({ table: req.body }); 
      
      res.status(201).json({
        message: "Table created successfully", 
        table: tableCreated 
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async getTables(req, res) {
    try {
      const tables = await TableService.getAllTables();

      res.status(200).json({
        tables
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }
}

module.exports = new TableController();