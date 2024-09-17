const express = require('express');
const db = require('../../db');
const router = express.Router();

router.post('/create', (req, res) => {
  const { produto_id, tipo, quantidade } = req.body;

  db.query('SELECT quantidade FROM produtos WHERE id = ?', [produto_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar o produto.' });
    if (result.length === 0) return res.status(404).json({ error: 'Produto não encontrado.' });

    const quantidadeAtual = result[0].quantidade;

    if (tipo === 'entrada') {

      const novaQuantidade = quantidadeAtual + parseInt(quantidade);
      db.query('UPDATE produtos SET quantidade = ? WHERE id = ?', [novaQuantidade, produto_id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar a quantidade.' });

        
        db.query(
          'INSERT INTO movimentacoes (produto_id, tipo, quantidade) VALUES (?, ?, ?)',
          [produto_id, tipo, quantidade],
          (err, result) => {
            if (err) return res.status(500).json({ error: 'Erro ao registrar movimentação.' });
            res.status(201).json({ message: 'Movimentação registrada e estoque atualizado com sucesso!' });
          }
        );
      });
    } else if (tipo === 'saida') {
      
      if (quantidade > quantidadeAtual) {
        return res.status(400).json({ error: 'Quantidade de saída maior que o estoque disponível.' });
      }

      
      const novaQuantidade = quantidadeAtual - parseInt(quantidade);
      db.query('UPDATE produtos SET quantidade = ? WHERE id = ?', [novaQuantidade, produto_id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar a quantidade.' });
        
        db.query(
          'INSERT INTO movimentacoes (produto_id, tipo, quantidade) VALUES (?, ?, ?)',
          [produto_id, tipo, quantidade],
          (err, result) => {
            if (err) return res.status(500).json({ error: 'Erro ao registrar movimentação.' });
            res.status(201).json({ message: 'Movimentação registrada e estoque atualizado com sucesso!' });
          }
        );
      });
    }
  });
});

router.get('/list', (req, res) => {
  db.query('SELECT * FROM movimentacoes', (err, movimentacoes) => {
    if (err) return res.status(500).json(err);
    res.json(movimentacoes);
  });
});

module.exports = router;