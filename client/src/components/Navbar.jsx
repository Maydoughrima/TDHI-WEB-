import React from "react";
import Logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";

function Navbar() {
    return (
        <nav className="bg-bg flex">
            <Link to ="/">
                <img src={Logo} alt="Logo" className="logo"/>
            </Link>

            {/* desktop links */}    
            <div className="d-links hidden flex">
            <Link>ONE</Link>
            <Link>ONE</Link>
            <Link>ONE</Link>
            <Link>ONE</Link>
            <Link>ONE</Link>
            <Link>ONE</Link>
            </div>

            
        </nav>
    )    
}
export default Navbar;