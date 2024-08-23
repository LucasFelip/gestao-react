import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import './ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProfilePage() {
    const [userData, setUserData] = useState({});
    const [planos, setPlanos] = useState([]);
    const [transacoes, setTransacoes] = useState([]);
    const [loadingUserData, setLoadingUserData] = useState(true);
    const [loadingPlanos, setLoadingPlanos] = useState(true);
    const [loadingTransacoes, setLoadingTransacoes] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoadingUserData(true);
                const userResponse = await fetch(`${process.env.REACT_APP_URL_API}/usuarios/current`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUserData(userData);
                } else {
                    throw new Error('Erro ao buscar os dados do usuário');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoadingUserData(false);
            }
        };

        const fetchPlanos = async () => {
            try {
                setLoadingPlanos(true);
                const planosResponse = await fetch(`${process.env.REACT_APP_URL_API}/planos-orcamentarios`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (planosResponse.ok) {
                    const planosData = await planosResponse.json();
                    setPlanos(planosData);
                } else {
                    throw new Error('Erro ao buscar os planos orçamentários');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoadingPlanos(false);
            }
        };

        fetchUserData();
        fetchPlanos();
    }, []);

    useEffect(() => {
        const fetchTransacoes = async () => {
            try {
                setLoadingTransacoes(true);
                const transacoesResponse = await fetch(`${process.env.REACT_APP_URL_API}/transacoes-financeiras/paginado?page=${page}&size=${size}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (transacoesResponse.ok) {
                    const transacoesData = await transacoesResponse.json();
                    setTransacoes(transacoesData.content);
                    setTotalPages(transacoesData.totalPages);
                } else {
                    throw new Error('Erro ao buscar as transações financeiras');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoadingTransacoes(false);
            }
        };

        fetchTransacoes();
    }, [page, size]);

    const handlePageClick = (pageNumber) => {
        setPage(pageNumber);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 0; i < totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={`btn btn-primary m-1 ${i === page ? 'active' : ''}`}
                    onClick={() => handlePageClick(i)}
                >
                    {i + 1}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h1 className="text-center mb-4">Perfil do Usuário</h1>

                <div className="row">
                    <div className="col-md-4">
                        <div className="card mb-4">
                            <div className="card-header">
                                <h2>Informações Pessoais</h2>
                            </div>
                            <div className="card-body">
                                {loadingUserData ? (
                                    <LoadingSpinner />
                                ) : (
                                    <>
                                        <p className="text-left"><strong>Nome:</strong> {userData.nome}</p>
                                        <p className="text-left"><strong>Email:</strong> {userData.email}</p>
                                        <p className="text-left"><strong>CPF:</strong> {userData.cpf}</p>
                                        <p className="text-left"><strong>Telefone:</strong> {userData.telefone}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="card mb-4">
                            <div className="card-header">
                                <h2>Planos Orçamentários</h2>
                            </div>
                            <div className="card-body">
                                {loadingPlanos ? (
                                    <LoadingSpinner />
                                ) : (
                                    planos.length > 0 ? (
                                        <table className="table table-striped table-responsive">
                                            <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Data Início</th>
                                                <th>Data Fim</th>
                                                <th>Valor Previsto</th>
                                                <th>Valor Realizado</th>
                                                <th>Situação</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {planos.map(plano => (
                                                <tr key={plano.id}>
                                                    <td>{plano.nome}</td>
                                                    <td>{plano.dataInicio ? new Date(plano.dataInicio).toLocaleDateString() : 'N/A'}</td>
                                                    <td>{plano.dataFim ? new Date(plano.dataFim).toLocaleDateString() : 'N/A'}</td>
                                                    <td>{plano.valorPrevisto ? plano.valorPrevisto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}</td>
                                                    <td>{plano.valorRealizado ? plano.valorRealizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}</td>
                                                    <td>{plano.ativo ? 'Ativo' : 'Inativo'}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>Nenhum plano orçamentário disponível.</p>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="card mb-4">
                            <div className="card-header">
                                <h2>Transações Financeiras</h2>
                            </div>
                            <div className="card-body">
                                {loadingTransacoes ? (
                                    <LoadingSpinner />
                                ) : (
                                    transacoes.length > 0 ? (
                                        <table className="table table-striped table-responsive">
                                            <thead>
                                            <tr>
                                                <th>Descrição</th>
                                                <th>Data</th>
                                                <th>Valor</th>
                                                <th>Tipo</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {transacoes.map(transacao => (
                                                <tr key={transacao.id}>
                                                    <td>{transacao.descricao}</td>
                                                    <td>{transacao.data ? new Date(transacao.data).toLocaleDateString() : 'N/A'}</td>
                                                    <td>{transacao.valor ? transacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}</td>
                                                    <td>{transacao.tipoTransacao}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>Nenhuma transação disponível.</p>
                                    )
                                )}
                                <div className="pagination-controls d-flex justify-content-center mt-3">
                                    {renderPageNumbers()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
