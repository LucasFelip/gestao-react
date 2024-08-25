import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import CategoriaList from '../../components/CategoriaList/CategoriaList';
import './HomePage.css';

function HomePage() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_URL_API}/auth/username`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (response.ok) {
                    const data = await response.text();
                    setUsername(data);
                } else {
                    console.error('Erro ao buscar o nome do usuário');
                }
            } catch (error) {
                console.error('Erro ao conectar ao servidor:', error);
            }
        };

        fetchUsername();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="home-content">
                {username && <h1>Bem-vindo, {username}!</h1>}
                <p>Aqui você pode gerenciar suas finanças.</p>

                <div className="categorias-section">
                    <CategoriaList tipo="RECEITA" />
                    <CategoriaList tipo="DESPESA" />
                </div>
            </div>
        </div>
    );
}

export default HomePage;
