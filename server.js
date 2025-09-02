const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const customersRouter = require('./routes/customers');
const addressesRouter = require('./routes/addresses');

app.use('/api/customers', customersRouter);
app.use('/api/addresses', addressesRouter);

app.get('/', (req, res) => res.json({ message: 'Customer CRUD API' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
