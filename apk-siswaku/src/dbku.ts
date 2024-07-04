import * as mysql from 'mysql';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

// Buat koneksi ke database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mahasiswa'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Buat aplikasi Hono
const app = new Hono();

// Endpoint untuk menampilkan 'Hallo World!'
app.get('/', (c) => {
  return c.text('Hallo World!');
});

// Endpoint untuk menampilkan data JSON
app.get('/data', (c) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM datasiswa', (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        reject(c.json({ error: error.message }, 500));
      } else {
        console.log('Query results:', results);
        resolve(c.json(results));
      }
    });
  });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
