const Table = require('../models/Table.model');

class TableService {
  async create({ table }) {
    const { tableNumber, location } = table;
    return await Table.create({
      tableNumber,
      location
    });
  }
  
  async updateTableStatus(tableId, status) {
    return await Table.findByIdAndUpdate(tableId, { status }, { new: true });
  }

  async getAllTables() {
    return await Table.find();
  } 
}

module.exports = new TableService();