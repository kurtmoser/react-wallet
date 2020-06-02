class Database {
  constructor(database) {
    this.database = database;
  }

  async getExpenses() {
    return await this.database('expenses');
  }

  async getExpense(id) {
    return (await this.database('expenses').where({id}))[0];
  }
}

module.exports = Database;
