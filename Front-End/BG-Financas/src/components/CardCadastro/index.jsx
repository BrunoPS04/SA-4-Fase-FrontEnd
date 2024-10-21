import React, { useState } from "react";
import "./index.css";
import axios from "axios";
import Modal from "react-modal";

function CardCadastro({ toggleForm, onCadastroComplete }) {

  const [modalCadastroIsOpen, setModalCadastroIsOpen] = useState(false);
  const [errorMenssage, setErrorMenssage] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    ultimoNome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

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
        setErrorMenssage("Todos os campos devem ser preenchidos.");
        setModalCadastroIsOpen(true);
        return;
      }
    }

    if (!formData.email.endsWith("@gmail.com")) {
      setErrorMenssage("O email deve terminar com @gmail.com.");
      setModalCadastroIsOpen(true);
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErrorMenssage("Senhas não conferem.");
      setModalCadastroIsOpen(true);
      return;
    }

    setErrorMenssage("");

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

      <button type="submit" className="btn-cadastro">
        Cadastrar-se
      </button>

      <label onClick={toggleForm} className="label-cadastro">
        Já possui cadastro? Login aqui
      </label>
      <Modal
        isOpen={modalCadastroIsOpen}
        onRequestClose={() => setModalCadastroIsOpen(false)}
        contentLabel="ModalCadastro"
        className="modal-cadastro"
      >
        <div className="modal-content-cadastro">
          <div className="modal-div-cadastro">
            <h2>Error ao relizar Cadastro</h2>
            <p>{errorMenssage}</p>
            <div className="modal-btn-cadastro">
              <button onClick={() => setModalCadastroIsOpen(false)}>Ok</button>
            </div>
          </div>
        </div>
      </Modal>
    </form>
  );
}

export default CardCadastro;
