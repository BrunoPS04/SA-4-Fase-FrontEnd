import React, { useState } from 'react';
import './index.css';

function NavBar() {
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
          <li><img src="./images/home.svg" alt="" /><a href="#">Home</a></li>
          <li><img src="./images/relatorio.svg" alt="" /><a href="#">Relatorios</a></li>
          <li><img src="./images/user.svg" alt="" /><a href="#">Editar Perfil</a></li>
          <div className='line-botton'></div>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
