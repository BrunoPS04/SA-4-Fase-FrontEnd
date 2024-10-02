import React from 'react';
import Painel from '../../pages/Painel';
import Relatorios from '../../pages/Relatorios';
import Perfil from '../../pages/Perfil';
import './index.css';

function Main({ activeComponent }) {
  
  const renderComponent = () => {
    switch (activeComponent) {
      case 'painel':
        return <Painel />;
      case 'relatorios':
        return <Relatorios />;
      case 'perfil':
        return <Perfil />;
      default:
        return <Painel />;
    }
  };

  return (
    <div className='main-container'>
      {renderComponent()}
    </div>
  );
}

export default Main;
