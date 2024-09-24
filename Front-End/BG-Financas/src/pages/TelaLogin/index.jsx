import React, { useState } from 'react';
import "./index.css";
import CardLogin from '../../components/CardLogin';
import CardCadastro from '../../components/CardCadastro';

function TelaLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [transitionClass, setTransitionClass] = useState('');

  const toggleForm = () => {
    setTransitionClass('slide-out');

    setTimeout(() => {
      setIsLogin(!isLogin);
      setTransitionClass('slide-in');
    }, 500);

    setTimeout(() => {
      setTransitionClass('');
    }, 1000);
  };

  const handleCadastroComplete = () => {
    setTransitionClass('slide-out');
    setTimeout(() => {
      setIsLogin(true);
      setTransitionClass('slide-in');
    }, 500);
    setTimeout(() => {
      setTransitionClass('');
    }, 1000);
  };

  return (
    <div className="tela-login-container">
      <div className="div-esquerda">
        <h1>BG Finanças<br />Planeje hoje, prospere amanhã</h1>
        <img src="./images/Finance.svg" className="img" title="Finance" />
      </div>

      <div className={`div-direita ${transitionClass}`}>
        {isLogin ? (
          <CardLogin toggleForm={toggleForm} />
        ) : (
          <CardCadastro toggleForm={toggleForm} onCadastroComplete={handleCadastroComplete} />
        )}
      </div>
    </div>
  );
}

export default TelaLogin;
