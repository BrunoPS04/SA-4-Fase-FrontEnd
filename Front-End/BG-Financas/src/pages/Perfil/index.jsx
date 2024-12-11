import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root"); 

function Perfil() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    senha: "",
  });

  const exibirMensagem = (mensagem, onClose) => {
    const modal = document.createElement("div");
    modal.className = "custom-alert-modal";
    modal.innerHTML = `
      <p>${mensagem}</p>
      <button class="custom-alert-btn">Ok</button>
    `;
  
    document.body.appendChild(modal);
  
    const btn = modal.querySelector(".custom-alert-btn");
    btn.addEventListener("click", () => {
      document.body.removeChild(modal);
      if (onClose) onClose(); 
    });
  };
  

  const [modalEditarIsOpen, setModalEditarIsOpen] = useState(false);
  const [token, setToken] = useState(""); 
  const [modalConfirmacaoIsOpen, setModalConfirmacaoIsOpen] = useState(false);
  const [backupData, setBackupData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          withCredentials: true,
        });
        const userData = response.data;
        setFormData({
          id: userData.id,
          email: userData.email,
          firstName: userData.nome,
          lastName: userData.ultimoNome,
          senha: "", 
        });
      } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error.response?.data || error.message);
      }
    };

    fetchUserProfile();
  }, [token]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const salvarAlteracoes = async () => {
    if (!formData.senha) {
      exibirMensagem("Por favor, digite sua senha para confirmar as alterações.");
      return;
    }
  
    if (!formData.email.endsWith("@gmail.com")) {
      exibirMensagem("O email deve terminar com @gmail.com.");
      return;
    }
  
    if (!formData.firstName.trim()) {
      exibirMensagem("O campo 'Nome' é obrigatório.");
      return;
    }
  
    if (!formData.lastName.trim()) {
      exibirMensagem("O campo 'Sobrenome' é obrigatório.");
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8080/users/${formData.id}`,
        {
          email: formData.email,
          nome: formData.firstName,
          ultimoNome: formData.lastName,
          senha: formData.senha,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        setFormData((prevData) => ({
          ...prevData,
          senha: "", 
        }));
  
        setModalEditarIsOpen(false); 
  
        exibirMensagem("Alterações salvas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar as alterações:", error.response?.data || error.message);
      exibirMensagem("Erro ao salvar as alterações. Tente novamente.");
    }
  };
  
  const cancelarEdicao = () => {
    if (backupData) {
      setFormData(backupData); 
    }
    setModalEditarIsOpen(false); 
  };

  const editarUsuario = () => {
    setBackupData({ ...formData });
    setModalEditarIsOpen(true);
  };

  const excluirConta = async () => {
    setModalConfirmacaoIsOpen(true); 
  };
  
  const confirmarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:8080/users/${formData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        withCredentials: true,
      });
  
      setModalConfirmacaoIsOpen(false); 
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir a conta:", error.response?.data || error.message);
      alert("Erro ao excluir a conta. Tente novamente.");
      setModalConfirmacaoIsOpen(false);  
    }
  };

  return (
    <div className="perfil-container">
      <div className="container">
        <h2 className="header">
          Olá, <span>{formData.firstName}</span> <span>{formData.lastName}</span>
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

            <div className="button-container">
              <button onClick={editarUsuario} className="save-button">
                Editar Perfil
              </button>
              <button className="cancel-button" onClick={excluirConta}>
                Excluir Conta
              </button>
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
        <h2>Editar Perfil</h2>

        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Sobrenome</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            name="senha"
            placeholder="Digite sua senha para confirmar"
            value={formData.senha}
            onChange={handleChange}
          />
        </div>

        <div className="div-btns-modal-editar">
          <button onClick={salvarAlteracoes} className="btn-save-modal-editar">
            Salvar
          </button>
          <button
            onClick={cancelarEdicao}
            className="btn-cancel-modal-editar"
          >
            Cancelar
          </button>
        </div>
      </Modal>

      <Modal
          isOpen={modalConfirmacaoIsOpen}
          onRequestClose={() => setModalConfirmacaoIsOpen(false)}
          contentLabel="Confirmar Exclusão"
          className="modal-confirmacao"
      >
         <h2>Você está excluindo sua conta</h2>
         <p>Você tem certeza que deseja excluir sua conta?</p>

     <div className="div-btns-modal-confirmacao">
          <button onClick={confirmarExclusao} className="btn-confirmar">
           Excluir
          </button>
    
          <button
           onClick={() => setModalConfirmacaoIsOpen(false)}
           className="btn-cancelar"
          >
            Cancelar
          </button>
      </div>
      </Modal>
    </div>
  );
}

export default Perfil;