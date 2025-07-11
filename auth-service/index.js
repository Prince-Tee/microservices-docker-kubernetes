const express = require('express');
const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    return res.json({ success: true, token: 'abc123' });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Auth Service' });
});

app.listen(5001, () => console.log('Auth Service running on port 5001'));
