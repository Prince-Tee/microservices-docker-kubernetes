const express = require('express');
const app = express();

const orders = [
  { id: 1, product: 'Laptop', quantity: 2 },
  { id: 2, product: 'Phone', quantity: 1 }
];

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Orders Service' });
});

app.get('/orders', (req, res) => {
  res.json(orders);
});

app.listen(5003, () => console.log('Orders Service running on port 5003'));
