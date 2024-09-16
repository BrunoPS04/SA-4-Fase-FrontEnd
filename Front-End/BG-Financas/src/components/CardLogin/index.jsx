import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function CardLogin({ toggleForm }) {

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const navigate = useNavigate();

  const handleLogin = () => {

    // Verifica se todos os campos estão preenchidos
    for (let key in formData) {
      if (formData[key] === '') {
        alert('Preencha todos os campos');
        return;
      }
    }

    if (!formData.email.endsWith('@gmail.com')) {

      return;
    }

    navigate('/home');
  };
  return (
    <div className="card-login-container">
      <h1>LOGIN</h1>

      <div className="login">
        <label htmlFor="usuario">Email</label>
        <input
          type="email"
          name="email"
          placeholder=""
          value={formData.email}
          onChange={handleChange} />
      </div>

      <div className="login">
        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          name="senha"
          placeholder=""
          value={formData.senha}
          onChange={handleChange} />
      </div>

      <button onClick={handleLogin} className="btn-login">Login</button>

      <label onClick={toggleForm} className="label-cadastro">
        Não possui cadastro? Cadastre-se aqui
      </label>
    </div>
  );
}

export default CardLogin;
