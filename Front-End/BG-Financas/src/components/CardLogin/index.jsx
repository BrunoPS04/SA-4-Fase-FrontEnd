import React from 'react';
import './index.css';

function CardLogin({ toggleForm }) {
  return (
    <div className="card-login-container">
      <h1>LOGIN</h1>

      <div className="login">
        <label htmlFor="usuario">Email</label>
        <input type="email" name="Email" placeholder="" />
      </div>

      <div className="login">
        <label htmlFor="senha">Senha</label>
        <input type="password" name="senha" placeholder="" />
      </div>

      <button className="btn-login">Login</button>

      <label onClick={toggleForm} className="label-cadastro">
        Não possui cadastro? Cadastre-se aqui
      </label>
    </div>
  );
}

export default CardLogin;
