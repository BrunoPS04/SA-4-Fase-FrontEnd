import React from "react";
import "./index.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { useEffect } from "react";
import Modal from "react-modal";

function Perfil() {
  const [modalEditarIsOpen, setModalEditarIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    senha: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/users/profile",
          {
            withCredentials: true,
          }
        );
        const userData = response.data;
        setFormData({
          email: userData.email,
          firstName: userData.nome,
          lastName: userData.ultimoNome,
          senha: userData.senha,
        });
      } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const editarUsuario = () => {
    setModalEditarIsOpen(true);
  };

  // Função para salvar as alterações
  const salvarAlteracoes = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/users/${formData.email}`,  // Substitua pela ID do usuário se necessário
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("Perfil atualizado com sucesso!");
        setModalEditarIsOpen(false);  // Fecha o modal após salvar
      }
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error);
      alert("Erro ao salvar as alterações. Tente novamente.");
    }
  };

  // Função para lidar com mudanças nos inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="perfil-container">
      <div className="container">
        <h2 className="header">
          Olá,<span> {formData.firstName}</span>
          <span> {formData.lastName}</span>
        </h2>
        <div className="form-container">
          <div className="left-container">
            <div className="form-group">
              <label className="lbl">Email</label>
              <input type="email" value={formData.email} readOnly />
            </div>
            <div className="form-group">
              <label className="lbl">Nome</label>
              <input type="text" value={formData.firstName} readOnly />
            </div>
            <div className="form-group">
              <label className="lbl">Sobrenome</label>
              <input type="text" value={formData.lastName} readOnly />
            </div>

            <div className="form-group-password">
              <label className="lbl">Senha</label>
              <div className="div-input-password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="senha"
                  value={formData.senha}
                  className="input-password"
                  readOnly
                />

                <button
                  className="btn-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FontAwesomeIcon className="icon-eye" icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon className="icon-eye" icon={faEye} />
                  )}
                </button>
              </div>
            </div>

            <div className="button-container">
              <button onClick={editarUsuario} className="save-button">Editar Perfil</button>
              <button className="cancel-button">Excluir Conta</button>
            </div>
          </div>

          <div className="right-container">
            <img src="./images/Finance.svg" className="img" title="Finance" />
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalEditarIsOpen}
        onRequestClose={() => setModalEditarIsOpen(false)}
        contentLabel="ModalEditar"
        className="modal-editar"
      >
        <div className="modal-container-editar">

        </div>
      </Modal>
    </div>
  );
}

export default Perfil;
