const express = require('express');
const router = express.Router();
const db = require('../db');

// Get addresses for a customer
router.get('/customer/:customerId', (req, res) => {
  const cid = req.params.customerId;
  db.all('SELECT * FROM addresses WHERE customerId = ?', [cid], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create address
router.post('/', (req, res) => {
  const { customerId, address, city, state, pincode } = req.body;
  if (!customerId || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Check customer exists
  db.get('SELECT * FROM customers WHERE id = ?', [customerId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(400).json({ error: 'Customer not found' });
    db.run('INSERT INTO addresses (customerId, address, city, state, pincode) VALUES (?, ?, ?, ?, ?)',
      [customerId, address, city, state, pincode], function(err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ id: this.lastID, message: 'Address added' });
      });
  });
});

// Update address
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { address, city, state, pincode } = req.body;
  db.run('UPDATE addresses SET address=?, city=?, state=?, pincode=? WHERE id=?',
    [address, city, state, pincode, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Address updated' });
    });
});

// Delete address
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM addresses WHERE id=?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Address deleted' });
  });
});

module.exports = router;
