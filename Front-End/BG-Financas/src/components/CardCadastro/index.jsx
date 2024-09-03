import React from 'react';
import "./index.css";

function CardCadastro({ toggleForm }) {
  return (
    <div className="card-cadastro-container">
      <h1>Cadastro</h1>

      <div className="cadastro">
        <label htmlFor="usuario">Nome</label>
        <input type="text" name="nome" placeholder="" />
      </div>

      <div className="cadastro">
        <label htmlFor="sobrenome">Sobrenome</label>
        <input type="text" name="sobrenome" placeholder="" />
      </div>

      <div className="cadastro">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="" />
      </div>

      <div className="cadastro">
        <label htmlFor="senha">Senha</label>
        <input type="password" name="senha" placeholder="" />
      </div>

      <div className="cadastro">
        <label htmlFor="confirmar-senha">Confirmar Senha</label>
        <input type="password" name="confirmar-senha" placeholder="" />
      </div>

      <button className="btn-cadastro">Cadastrar-se</button>

      <label onClick={toggleForm} className="label-cadastro">
        Já possui cadastro? Login aqui
      </label>
    </div>
  );
}

export default CardCadastro;
