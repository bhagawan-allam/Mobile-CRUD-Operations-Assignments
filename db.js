const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFile = path.join(__dirname, 'customer.db');

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
    return;
  }
  console.log('Connected to SQLite database:', dbFile);

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT,
      state TEXT,
      pincode TEXT,
      onlyOneAddress INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId INTEGER,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      FOREIGN KEY(customerId) REFERENCES customers(id)
    )`);

    // Seed only if empty
    db.get('SELECT COUNT(*) as count FROM customers', (err, row) => {
      if (err) {
        console.error('Count error', err.message);
        return;
      }
      if (row.count === 0) {
        console.log('Seeding sample data...');
        const insertCustomers = db.prepare('INSERT INTO customers (firstName, lastName, phone, city, state, pincode, onlyOneAddress) VALUES (?, ?, ?, ?, ?, ?, ?)');
        insertCustomers.run('John', 'Doe', '9876543210', 'Hyderabad', 'Telangana', '500081', 0);
        insertCustomers.run('Jane', 'Smith', '9123456780', 'Bengaluru', 'Karnataka', '560066', 0);
        insertCustomers.run('Amit', 'Sharma', '9876000001', 'Delhi', 'Delhi', '110001', 1);
        insertCustomers.finalize();

        const insertAddresses = db.prepare('INSERT INTO addresses (customerId, address, city, state, pincode) VALUES (?, ?, ?, ?, ?)');
        insertAddresses.run(1, '123 Street, Madhapur', 'Hyderabad', 'Telangana', '500081');
        insertAddresses.run(1, '456 Lane, Gachibowli', 'Hyderabad', 'Telangana', '500032');
        insertAddresses.run(2, 'MG Road, Whitefield', 'Bengaluru', 'Karnataka', '560066');
        insertAddresses.run(3, 'Connaught Place', 'Delhi', 'Delhi', '110001');
        insertAddresses.finalize();
      }
    });
  });
});

module.exports = db;
