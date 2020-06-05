class Database {
  constructor(database) {
    this.database = database;
  }

  async getExpenses() {
    return(await this.database('expenses').select('*').orderBy('sdate', 'desc').limit(10));
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

  async getTopLocations(prefix = '') {
    // Return suggestions as follows:
    // - if prefix is exact match then nothing
    // - if no prefix then search from last 50 records
    // - otherwise search from last 500 records

    // Search from larger pool if prefix provided
    const limit = prefix ? 500 : 50;

    let query = this.database.with('with_expenses', (qb) => {
        qb.select('*').from('expenses').orderBy('sdate', 'desc').limit(limit)
      })
      .select(this.database.raw('location, count(1) as popularity'))
      .from('with_expenses')
      .groupBy('location')
      .orderBy('popularity', 'desc')
      .limit(5);

    if (prefix) {
      query = query.where('location', 'like', prefix + '%');
    }

    const res = await query;

    for (let i = 0; i < res.length; i++) {
      if (res[i].location.toLowerCase() === prefix.toLocaleLowerCase()) {
        return [];
      }
    }

    return res;
  }

  async getTopGoods(prefix = '', location = '') {
    // Check location existance
    let locationSpecificQuery = false;
    if (location) {
      const locationRes = await this.database
        .select(this.database.raw('COUNT(1) as total_count'))
        .from('expenses')
        .where('location', location);

      if (locationRes[0].total_count) {
        locationSpecificQuery = true;
      }
    }

    let query = this.database.with('with_expenses', (qb) => {
        if (locationSpecificQuery) {
          qb.select('*').from('expenses').where('location', location);
        } else {
          qb.select('*').from('expenses');
        }
      })
      .select(this.database.raw('goods, count(1) as popularity'))
      .from('with_expenses')
      .groupBy('goods')
      .orderBy('popularity', 'desc')
      .limit(5);

    if (prefix) {
      query = query.where('goods', 'like', prefix + '%');
    }

    const res = await query;

    for (let i = 0; i < res.length; i++) {
      if (res[i].goods.toLowerCase() === prefix.toLocaleLowerCase()) {
        return [];
      }
    }

    return res;
  }
}

module.exports = Database;
