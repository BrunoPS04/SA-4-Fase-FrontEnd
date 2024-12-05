import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faChartColumn, faUserPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './index.css';

function NavBar({ setActiveComponent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('Usuário'); // Estado para armazenar o nome do usuário

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const userId = localStorage.getItem("userId"); // Pegue o ID do usuário armazenado no localStorage

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/users/${userId}`) // A URL deve ser ajustada conforme o seu backend
        .then(response => {
          setUserName(response.data.nome); // Defina o nome do usuário ao receber a resposta
        })
        .catch(error => {
          console.error("Erro ao buscar o usuário", error);
        });
    }
  }, [userId]);

  return (
    <div className='navbar-container'>
      <nav>
        <div className="mobile-menu" onClick={toggleMenu}>
          <div className={`line1 ${isOpen ? 'open' : ''}`}></div>
          <div className={`line2 ${isOpen ? 'open' : ''}`}></div>
          <div className={`line3 ${isOpen ? 'open' : ''}`}></div>
        </div>
        <ul className={`nav-list ${isOpen ? 'open' : ''}`}>
          <div className='div-nome-user'><label>Olá,<span>{userName}</span></label></div>
          <li onClick={() => setActiveComponent('painel')}>
            <FontAwesomeIcon className='icon-home' icon={faHouse} /> <a>Home</a>
          </li>
          <li onClick={() => setActiveComponent('relatorios')}>
            <FontAwesomeIcon className='icon-chart' icon={faChartColumn} /> <a>Relatórios</a>
          </li>
          <li onClick={() => setActiveComponent('perfil')}>
            <FontAwesomeIcon className='icon-user-pen' icon={faUserPen} /> <a>Editar Perfil</a>
          </li>
          <div className='line-botton'></div>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
