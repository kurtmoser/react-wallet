exports.up = function(knex) {
  return knex.schema
    .createTable('expenses', table => {
      table.increments('id').primary();
      table.decimal('amount').notNullable();
      table.date('sdate').notNullable();  // ... as in spend date
      table.string('location').notNullable();
      table.string('goods').notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('expenses');
};
