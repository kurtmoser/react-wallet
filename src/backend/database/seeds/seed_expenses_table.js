const faker = require('faker');
const dateFns = require('date-fns');

exports.seed = function(knex) {
  return knex('expenses').del()
    .then(function () {
      let expenses = [];

      const endDate = new Date();
      const startDate = dateFns.subDays(endDate, 7);

      for (let i = 0; i < 20; i++) {
        expenses.push({
          amount: faker.commerce.price(),
          sdate: dateFns.format(
            faker.date.between(
              dateFns.format(startDate, 'yyyy-MM-dd'),
              dateFns.format(endDate, 'yyyy-MM-dd')
            ),
            'yyyy-MM-dd'
          ),
          location: faker.commerce.department(),
          goods: faker.commerce.product(),
        });
      }

      return knex('expenses').insert(expenses);
    });
};
