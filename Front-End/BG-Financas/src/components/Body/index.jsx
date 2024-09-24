import React, { useState } from 'react';
import './index.css';
import NavBar from '../NavBar';
import Main from '../Main';

function Body() {
  const [activeComponent, setActiveComponent] = useState('painel');

  return (
    <div className='body-container'>
      <NavBar setActiveComponent={setActiveComponent} />
      <Main activeComponent={activeComponent} />
    </div>
  );
}

export default Body;
