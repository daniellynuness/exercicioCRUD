const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;
const path = require('path'); // Importa o módulo path para manipular caminhos de arquivos

// Configurações
app.use(cors());
app.use(express.json());

// Banco de dados
const dbPath = path.join(__dirname, 'database.db'); // Define o caminho para o arquivo do banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS pessoa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      idade INTEGER
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log('Tabela "pessoa" garantida no banco de dados.');
    }
  });
});

// Rotas

// Criar pessoa
app.post('/pessoas', (req, res) => {
  const { nome, email, idade } = req.body;
  db.run(
    'INSERT INTO pessoa (nome, email, idade) VALUES (?, ?, ?)',
    [nome, email, idade],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID, nome, email, idade });
    }
  );
});

// Listar pessoas
app.get('/pessoas', (req, res) => {
  db.all('SELECT * FROM pessoa', [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Atualizar pessoa
app.put('/pessoas/:id', (req, res) => {
  const { nome, email, idade } = req.body;
  const { id } = req.params;
  db.run(
    'UPDATE pessoa SET nome = ?, email = ?, idade = ? WHERE id = ?',
    [nome, email, idade, id],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ updated: this.changes });
    }
  );
});

// Deletar pessoa
app.delete('/pessoas/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM pessoa WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

// Start
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});