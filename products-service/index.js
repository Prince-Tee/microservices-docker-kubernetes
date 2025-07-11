const express = require('express');
const app = express();

const products = [
  { id: 1, name: 'Laptop', price: 1500 },
  { id: 2, name: 'Phone', price: 800 }
];
app.get('/', (req, res) => {
  res.send('Products Service is running!');
});

app.get('/products', (req, res) => { res.json(products);
});

app.listen(5002, () => console.log('Products Service running on port 5002'));
