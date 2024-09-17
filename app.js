const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('../produto-estoque/db')
const path = require('path');
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const movementRoutes = require('./src/routes/movements');


dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.db = db;  
  next();
});

app.use('/auth', authRoutes); 
app.use('/produtos', productRoutes);  
app.use('/movimentacoes', movementRoutes);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src/views')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

