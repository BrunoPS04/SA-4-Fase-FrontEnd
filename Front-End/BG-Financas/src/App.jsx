import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import TelaLogin from './components/TelaLogin'

function App() {
  
  return (

    <div className='app-container'>

       <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      
    </div>

  )

}

export default App
