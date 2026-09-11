const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});
client.connect()
  .then(async () => {
    try {
      await client.query('CREATE DATABASE medclinic;');
      console.log('Database medclinic created successfully');
    } catch(e) {
      console.log('Error creating db:', e.message);
    }
  })
  .finally(() => client.end());
