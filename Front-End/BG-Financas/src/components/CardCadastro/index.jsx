import React, { useState } from 'react';
import "./index.css";

function CardCadastro({ toggleForm, onCadastroComplete }) {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCadastro = () => {

    // Verifica se todos os campos estão preenchidos
    for (let key in formData) {
      if (formData[key] === '') {
        setError('Todos os campos devem ser preenchidos.');
        return;
      }
    }

    if (!formData.email.endsWith('@gmail.com')) {
      setError('O email deve terminar com @gmail.com.');
      return;
    }

    // Verifica se as senhas coincidem
    if (formData.senha !== formData.confirmarSenha) {
      setError('Senhas não conferem.');
      return;
    }

    setError('');
    console.log('Cadastro realizado com sucesso:', formData);

    if (onCadastroComplete) onCadastroComplete();
  };

  return (
    <div className="card-cadastro-container">
      <h1>Cadastro</h1>

      <div className="cadastro">
        <label htmlFor="nome">Nome</label>
        <input 
          type="text" 
          name="nome" 
          placeholder="" 
          value={formData.nome}
          onChange={handleChange}
        />
      </div>

      <div className="cadastro">
        <label htmlFor="sobrenome">Sobrenome</label>
        <input 
          type="text" 
          name="sobrenome" 
          placeholder="" 
          value={formData.sobrenome}
          onChange={handleChange}
        />
      </div>

      <div className="cadastro">
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          name="email" 
          placeholder="" 
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="cadastro">
        <label htmlFor="senha">Senha</label>
        <input 
          type="password" 
          name="senha" 
          placeholder="" 
          value={formData.senha}
          onChange={handleChange}
        />
      </div>

      <div className="cadastro">
        <label htmlFor="confirmarSenha">Confirmar Senha</label>
        <input 
          type="password" 
          name="confirmarSenha" 
          placeholder="" 
          value={formData.confirmarSenha}
          onChange={handleChange}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button onClick={handleCadastro} className="btn-cadastro">Cadastrar-se</button>

      <label onClick={toggleForm} className="label-cadastro">
        Já possui cadastro? Login aqui
      </label>
    </div>
  );
}

export default CardCadastro;
