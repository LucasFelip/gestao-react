import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';  // Verifique o caminho aqui

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
                    const data = await response.text();  // Assume que o backend retorna o nome como texto
                    setUsername(data);
                } else {
                    console.error('Erro ao buscar o nome do usuário');
                }
            } catch (error) {
                console.error('Erro ao conectar ao servidor:', error);
            }
        };

        fetchUsername();
    }, []);  // Executa uma vez após a montagem do componente

    return (
        <div>
            <Navbar />  {/* Inclui a navbar no topo */}
            <div className="home-content">
                {username && <h1>Bem-vindo {username}!</h1>}  {/* Exibe o nome do usuário */}
                <p>Aqui você pode gerenciar suas finanças.</p>
                {/* Adicione mais seções ou informações conforme necessário */}
            </div>
        </div>
    );
}

export default HomePage;