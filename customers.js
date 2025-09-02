const express = require('express');
const router = express.Router();
const db = require('../db');

// Create customer
router.post('/', (req, res) => {
  const { firstName, lastName, phone, city, state, pincode } = req.body;
  if (!firstName || !lastName || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const stmt = 'INSERT INTO customers (firstName, lastName, phone, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(stmt, [firstName, lastName, phone, city, state, pincode], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, message: 'Customer created' });
  });
});

// Read customers with optional filters, pagination and sorting
router.get('/', (req, res) => {
  const { city, state, pincode, search, page = 1, limit = 10, sortBy = 'id', sortDir = 'ASC' } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  let where = [];
  let params = [];
  if (city) { where.push('city = ?'); params.push(city); }
  if (state) { where.push('state = ?'); params.push(state); }
  if (pincode) { where.push('pincode = ?'); params.push(pincode); }
  if (search) { where.push('(firstName LIKE ? OR lastName LIKE ? OR phone LIKE ?)'); params.push('%'+search+'%','%'+search+'%','%'+search+'%'); }

  const whereSQL = where.length ? ('WHERE ' + where.join(' AND ')) : '';
  const countSQL = `SELECT COUNT(*) as count FROM customers ${whereSQL}`;
  db.get(countSQL, params, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = row.count;
    const sql = `SELECT * FROM customers ${whereSQL} ORDER BY ${sortBy} ${sortDir} LIMIT ? OFFSET ?`;
    db.all(sql, params.concat([limit, offset]), (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ data: rows, total, page: Number(page), limit: Number(limit) });
    });
  });
});

// Read customer by ID (with addresses)
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM customers WHERE id = ?', [id], (err, customer) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    db.all('SELECT * FROM addresses WHERE customerId = ?', [id], (err2, addresses) => {
      if (err2) return res.status(500).json({ error: err2.message });
      customer.addresses = addresses;
      res.json(customer);
    });
  });
});

// Update customer
router.put('/:id', (req, res) => {
  const { firstName, lastName, phone, city, state, pincode } = req.body;
  const id = req.params.id;
  db.run('UPDATE customers SET firstName=?, lastName=?, phone=?, city=?, state=?, pincode=? WHERE id=?',
    [firstName, lastName, phone, city, state, pincode, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Customer updated' });
    });
});

// Delete customer (prevent deletion if addresses exist)
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT COUNT(*) as count FROM addresses WHERE customerId = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row.count > 0) {
      return res.status(400).json({ error: 'Customer has linked addresses. Delete addresses first.' });
    }
    db.run('DELETE FROM customers WHERE id = ?', [id], function(err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Customer deleted' });
    });
  });
});

// Mark onlyOneAddress flag (true/false)
router.put('/:id/only-one', (req, res) => {
  const id = req.params.id;
  const { onlyOne } = req.body; // boolean
  db.run('UPDATE customers SET onlyOneAddress = ? WHERE id = ?', [onlyOne ? 1 : 0, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'onlyOneAddress updated' });
  });
});

module.exports = router;
