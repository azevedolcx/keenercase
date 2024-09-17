const express = require('express');
const db = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao verificar email.' });

      if (results.length > 0) {
        return res.status(400).json({ error: 'Email já cadastrado.' });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashedPassword], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar o cadastro.' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuário.' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos.' });
    }

    const user = results[0];
    
    try {
      const match = await bcrypt.compare(password, user.senha);
      if (match) {
        const token = jwt.sign({ id: user.id, email: user.email }, '2471', { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Email ou senha incorretos.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao comparar senhas.' });
    }
  });
});

module.exports = router;
