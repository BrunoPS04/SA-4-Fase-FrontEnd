import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import axios from "axios";
import Modal from "react-modal";

function CardLogin({ toggleForm }) {
  const navigate = useNavigate();

  const [modalLoginIsOpen, setModalLoginIsOpen] = useState(false);
  const [errorMenssage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    // Verifica se todos os campos estão preenchidos
    for (let key in formData) {
      if (formData[key] === "") {
        setErrorMessage("Por favor, preencha todos os campos.");
        setModalLoginIsOpen(true);
        return;
      }
    }

    // Validação para verificar se o email termina com @gmail.com
    if (!formData.email.endsWith("@gmail.com")) {
      setErrorMessage("O email deve ser um endereço @gmail.com.");
      setModalLoginIsOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/users/login",
        formData,
        { withCredentials: true }  // Certifique-se de enviar credenciais (cookies)
      );

      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("Email ou senha incorretos.");
        } else if (error.response.status === 404) {
          setErrorMessage("Usuário não encontrado.");
        } else {
          setErrorMessage("Erro desconhecido ao fazer login. Tente novamente.");
        }
      } else {
        setErrorMessage("Erro de conexão com o servidor. Tente novamente.");
      }
      setModalLoginIsOpen(true);
    }
  };

  return (
    <div className="card-login-container">
      <h1>LOGIN</h1>
      <div className="login">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="login">
        <label>Senha</label>
        <input
          type="password"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleLogin} className="btn-login">Login</button>
      <label onClick={toggleForm} className="label-cadastro">
        Não possui cadastro? Cadastre-se aqui
      </label>

      <Modal
        isOpen={modalLoginIsOpen}
        onRequestClose={() => setModalLoginIsOpen(false)}
        contentLabel="ModalLogin"
        className="modal-login"
      >
        <div className="modal-content-login">
          <h2>Error ao relizar Login</h2>
          <p>{errorMenssage}</p>
          <button onClick={() => setModalLoginIsOpen(false)}>Ok</button>
        </div>
      </Modal>
    </div>
  );
}

export default CardLogin;
