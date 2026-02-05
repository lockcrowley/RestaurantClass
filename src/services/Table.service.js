const Table = require('../models/Table.model');

class TableService {
  async create({ tableNumber, location, capacity }) {
   
    return await Table.create({
      tableNumber,
      location,
      capacity
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