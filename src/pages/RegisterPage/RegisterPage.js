import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/LoginRegister.css';

function RegisterPage() {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        setLoading(true);
        setErrorMessage('');

        const novoUsuario = {
            nome: nome,
            cpf: cpf,
            email: email,
            senha: senha,
            telefone: telefone
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_URL_API}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoUsuario),
            });

            if (response.ok) {
                console.log("Usuário registrado com sucesso!");
                navigate('/login');
            } else {
                const errorText = await response.text();
                console.error("Erro ao registrar usuário:", errorText || "Erro desconhecido");
                setErrorMessage("Erro ao registrar usuário: " + (errorText || "Tente novamente mais tarde."));
            }
        } catch (error) {
            console.error('Erro ao registrar:', error);
            setErrorMessage("Erro ao registrar: Não foi possível conectar ao servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Registrar</h2>
            <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="input-field"
            />
            <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="input-field"
            />
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
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input-field"
            />
            <input
                type="text"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="input-field"
            />
            {errorMessage && <div className="error-message">{errorMessage}</div>}  {/* Exibe a mensagem de erro */}
            <button onClick={handleRegister} className="login-button" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrar'}
            </button>
            <p className="text-link" onClick={() => navigate('/login')}>Já tem uma conta? Faça login</p>
        </div>
    );
}

export default RegisterPage;