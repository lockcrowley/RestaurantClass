const TableService = require('../services/Table.service.js');

class TableController {
  async createTable(req, res) {
    try {
       const { tableNumber, location, capacity } = req.body;

      const tableCreated = await TableService.create({ tableNumber, location, capacity }); 

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

  async updateTableStatus(req, res) {
    try {
      const tableId = req.params.id;
      const { status } = req.body;

      const updatedTable = await TableService.updateTableStatus(tableId, status);

      res.status(200).json({
        message: "Table status updated successfully",
        table: updatedTable
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }

  async deleteTable(req, res) {
    try {
      const tableId = req.params.id;

      const result = await TableService.deleteTableById({ tableId });

      res.status(200).json({
        message: result
      });
    } catch (error) {
      res.status(500).json({
        error: error.message 
      });
    }
  }
}

module.exports = new TableController();