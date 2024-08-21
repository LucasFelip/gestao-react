import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Fazendo a requisição de logout para o backend
            const response = await fetch(`${process.env.REACT_APP_URL_API}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                console.error("Erro ao fazer logout");
            }
        } catch (error) {
            console.error("Erro ao conectar ao servidor de logout:", error);
        }
    };

    const handleNavigation = (path) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn("Token não encontrado. Redirecionando para a página de login.");
            navigate('/login');
        } else {
            console.log("Token encontrado. Navegando para:", path);
            navigate(path);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <ul className="navbar-list">
                    <li><button onClick={() => handleNavigation('/home')}>Home</button></li>
                </ul>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;