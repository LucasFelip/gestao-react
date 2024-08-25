import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

function CategoriaList({ tipo }) {
    const [categorias, setCategorias] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategorias = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_URL_API}/categorias/tipo/paginado?tipo=${tipo}&page=${page}&size=${size}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCategorias(data.content);
                    setTotalPages(data.totalPages);
                } else {
                    setError('Erro ao buscar categorias');
                }
            } catch (error) {
                setError('Erro ao conectar ao servidor');
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
    }, [tipo, page, size]);

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
        <div className="categoria-list">
            <h3>Categorias de {tipo}</h3>
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <>
                    {categorias.length > 0 ? (
                        <table className="table table-striped table-responsive">
                            <tbody>
                            {categorias.map(categoria => (
                                <tr key={categoria.id}>
                                    <td>{categoria.nome}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Nenhuma categoria disponível.</p>
                    )}
                    <div className="pagination-controls d-flex justify-content-center mt-3">
                        {renderPageNumbers()}
                    </div>
                </>
            )}
        </div>
    );
}

export default CategoriaList;
