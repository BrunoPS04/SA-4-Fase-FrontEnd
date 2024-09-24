import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faChartColumn, faUserPen } from '@fortawesome/free-solid-svg-icons';
import './index.css';

function NavBar({ setActiveComponent }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='navbar-container'>
      <nav>
        <div className="mobile-menu" onClick={toggleMenu}>
          <div className={`line1 ${isOpen ? 'open' : ''}`}></div>
          <div className={`line2 ${isOpen ? 'open' : ''}`}></div>
          <div className={`line3 ${isOpen ? 'open' : ''}`}></div>
        </div>
        <ul className={`nav-list ${isOpen ? 'open' : ''}`}>
          <div className='div-nome-user'><label>Olá,<span>Usuário</span></label></div>
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
