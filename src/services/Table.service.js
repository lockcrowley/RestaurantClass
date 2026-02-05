const Table = require('../models/Table.model');

class TableService {
  async create({ table }) {
    const { tableNumber, location } = table;
    return await Table.create({
      tableNumber,
      location
    });
  }

  async getAllTables() {
    return await Table.find();
  }
  
  async updateTableStatus(tableId, status) {
    return await Table.findByIdAndUpdate(tableId, { status }, { new: true });
  }

  async deleteTableById({ tableId }) {
    await Table.findByIdAndDelete(tableId);
    return 'Table deleted successfully';
  }
 
}

module.exports = new TableService();