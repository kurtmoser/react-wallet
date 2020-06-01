module.exports = {
  client: 'sqlite3',
  connection: {
    filename: './src/backend/database/db.sqlite',
  },
  migrations: {
    directory: './src/backend/database/migrations',
  },
  seeds: {
    directory: './src/backend/database/seeds',
  },
};
