import React, { useState } from "react";
import "./index.css";
import axios from "axios";

function CardCadastro({ toggleForm, onCadastroComplete }) {

  const [formData, setFormData] = useState({
    nome: "",
    ultimoNome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação do formulário
    for (let key in formData) {
      if (formData[key] === "" && key !== "confirmarSenha") {
        setError("Todos os campos devem ser preenchidos.");
        return;
      }
    }

    if (!formData.email.endsWith("@gmail.com")) {
      setError("O email deve terminar com @gmail.com.");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("Senhas não conferem.");
      return;
    }

    setError("");

    try {
      
      // Adicionar novo cliente (POST)
      const response = await axios.post(
        "http://localhost:8080/users",
        formData
      );
      if (response.status === 201) {
        setFormData({
          nome: "",
          ultimoNome: "",
          email: "",
          senha: "",
          confirmarSenha: "",
        }); // Limpa o formulário
        console.log("Cliente cadastrado com sucesso!");
        onCadastroComplete();
      }
    } catch (error) {
      console.error("Erro ao adicionar/atualizar user:", error);
      setError("Ocorreu um erro ao enviar os dados.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-cadastro-container">
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
          name="ultimoNome"
          placeholder=""
          value={formData.ultimoNome}
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

      <button type="submit" className="btn-cadastro">
        Cadastrar-se
      </button>

      <label onClick={toggleForm} className="label-cadastro">
        Já possui cadastro? Login aqui
      </label>
    </form>
  );
}

export default CardCadastro;
