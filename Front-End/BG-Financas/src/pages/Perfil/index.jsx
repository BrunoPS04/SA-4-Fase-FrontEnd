import React from "react";
import "./index.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

function Perfil() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    senha: "Test123456",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log("Changes saved", formData);
  };

  const handleCancel = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      senha: "",
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
          Olá,<span> Bruno</span>
          <span> Severino</span>
        </h2>
        <div className="form-container">
          <div className="left-container">
            <div className="form-group">
              <label className="lbl">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="lbl">Nome</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input"
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="lbl">Sobrenome</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input"
                readOnly
              />
            </div>

            <div className="form-group-password">
              <label className="lbl">Senha</label>
              <div className="div-input-password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="input-password"
                  readOnly
                />

                <button className="btn-password" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <FontAwesomeIcon className="icon-eye" icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon className="icon-eye" icon={faEye} />
                  )}
                </button>
              </div>
            </div>

            <div className="button-container">
              <button onClick={handleSave} className="save-button">
                Salvar Mudanças
              </button>
              <button onClick={handleCancel} className="cancel-button">
                Cancelar
              </button>
            </div>
          </div>

          <div className="right-container">
            <img src="./images/Finance.svg" className="img" title="Finance" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
