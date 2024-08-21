import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        setErrorMessage('');

        const usuario = {
            email: email,
            senha: password
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_URL_API}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });

            if (!response.ok) {
                const errorText = await response.text();
                setErrorMessage("Erro ao fazer login: " + (errorText || "Verifique suas credenciais."));
                setLoading(false);
                return;
            }

            const data = await response.json();
            if (data.accessToken) {
                localStorage.setItem('token', data.accessToken);
                navigate('/home');
            } else {
                console.error("Token JWT não encontrado na resposta.");
                setErrorMessage("Login falhou: Token JWT não encontrado.");
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setErrorMessage("Erro ao fazer login: Não foi possível conectar ao servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
            />
            {errorMessage && <div className="error-message">{errorMessage}</div>}  {/* Exibe a mensagem de erro */}
            <button onClick={handleLogin} className="login-button" disabled={loading}>
                {loading ? 'Entrando...' : 'Login'}
            </button>
            <p className="text-link" onClick={() => navigate('/register')}>Ainda não tem uma conta? Registre-se</p>
        </div>
    );
}

export default LoginPage;