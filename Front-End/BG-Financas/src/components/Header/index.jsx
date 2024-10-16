import React, { useState } from "react";
import DarkMode from "../DarkMode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Modal from "react-modal";

function Header() {

  const [modalAlertLogout, setModalAlertLogout] = useState(false);
  const [logoutComfirm, setLogoutComfirm] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    setModalAlertLogout(true);
  };

  const handleLogout = () => {
    setLogoutComfirm(true);
    setModalAlertLogout(false);
    navigate("/");
  };

  return (
    <div className="header-container">
      <header>
        <div className="div-logo">
          <span>BG </span>
          <label>Finanças</label>
        </div>
        <div className="div-exit">
          <div className="dark-mode">
            <DarkMode />
          </div>
          <FontAwesomeIcon
            className="door-exit"
            icon={faArrowRightFromBracket}
          />
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <Modal
        isOpen={modalAlertLogout}
        onRequestClose={() => setModalAlertLogout(false)}
        contentLabel="contentDeletarMovimentacao"
        className="custom-modal-logout"
      >
        <div className="modal-content-logout">
          <div className="modal-div-logout">
            <h2>Você está saindo do site</h2>
            <p>Você tem certeza que deseja sair?</p>
          </div>
          <div className="modal-btns-logout">
            <button
              className="btn-comfirm-logout"
              onClick={handleLogout}
            >
              Sair
            </button>

            <button
              className="btn-cancelar-logout"
              onClick={() => setModalAlertLogout(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Header;
