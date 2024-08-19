import React from 'react'
import './index.css'

function Header() {

    return (

        <div className='header-container'>

            <header>
                <div className='div-logo'>
                    <span>BG </span><label>Finanças</label>
                </div>
                <div className='div-exit'>
                    <img src="./images/exit.svg" alt="" />
                    <button>Logout</button>
                </div>
            </header>

        </div>

    )

}

export default Header
