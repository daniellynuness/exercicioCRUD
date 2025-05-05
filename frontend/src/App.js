import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [pessoas, setPessoas] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', idade: '' });
  const [editId, setEditId] = useState(null);

  const fetchPessoas = async () => {
    const res = await axios.get('http://localhost:3001/pessoas');
    setPessoas(res.data);
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:3001/pessoas/${editId}`, form);
    } else {
      await axios.post('http://localhost:3001/pessoas', form);
    }
    setForm({ nome: '', email: '', idade: '' });
    setEditId(null);
    fetchPessoas();
  };

  const handleEdit = (pessoa) => {
    setForm({ nome: pessoa.nome, email: pessoa.email, idade: pessoa.idade });
    setEditId(pessoa.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/pessoas/${id}`);
    fetchPessoas();
  };

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Cadastro de Pessoas</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Idade"
          type="number"
          value={form.idade}
          onChange={(e) => setForm({ ...form, idade: e.target.value })}
        />
        <button type="submit">{editId ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((pessoa) => (
            <tr key={pessoa.id}>
              <td>{pessoa.nome}</td>
              <td>{pessoa.email}</td>
              <td>{pessoa.idade}</td>
              <td>
                <button onClick={() => handleEdit(pessoa)}>Editar</button>
                <button onClick={() => handleDelete(pessoa.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;