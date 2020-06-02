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

  async insertExpense(data) {
    const expenseId = (await this.database('expenses').insert(data).returning('id'))[0];

    return await this.getExpense(expenseId);
  }

  async editExpense(id, data) {
    await this.database('expenses').where('id', id).update(data);

    return await this.getExpense(id);
  }

  async deleteExpense(id) {
    await this.database('expenses').where('id', id).delete();
  }
}

module.exports = Database;
