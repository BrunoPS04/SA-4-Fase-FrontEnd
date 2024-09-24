import React from 'react'
import DarkMode from '../DarkMode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import './index.css'

function Header() {

    const navigate = useNavigate();

    const logout = () => {

        const confirmLogout = window.confirm('Você realmente quer sair do site?');
        
        if (confirmLogout) {
            navigate('/'); 
        }
        
    }

    return (

        <div className='header-container'>

            <header>
                <div className='div-logo'>
                    <span>BG </span><label>Finanças</label>
                </div>
                <div className='div-exit'>
                    <div className='dark-mode'>
                    <DarkMode />
                    </div>
                    <FontAwesomeIcon className='door-exit' icon={faArrowRightFromBracket}/>
                    <button onClick={logout}>Logout</button>
                </div>
            </header>

        </div>

    )

}

export default Header
