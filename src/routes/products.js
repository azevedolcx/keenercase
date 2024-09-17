const express = require('express');
const db = require('../../db');
const router = express.Router();

router.post('/create', (req, res) => {
  const { nome, descricao, preco, quantidade } = req.body;

  db.query(
    'INSERT INTO produtos (nome, descricao, preco, quantidade) VALUES (?, ?, ?, ?)',
    [nome, descricao, preco, quantidade],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: 'Produto cadastrado!' });
    }
  );
});

router.get('/list', (req, res) => {
    db.query('SELECT * FROM produtos', (err, produtos) => {
      if (err) return res.status(500).json(err);
      res.json(produtos);
    });
  });
  
module.exports = router;
