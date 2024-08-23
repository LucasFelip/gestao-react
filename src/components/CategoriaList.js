import React, { useState, useEffect } from 'react';
import './CategoriaList.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function CategoriaList({ tipo }) {
    const [categorias, setCategorias] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

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
                    console.error('Erro ao buscar categorias');
                }
            } catch (error) {
                console.error('Erro ao conectar ao servidor:', error);
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
                    className={`page-number ${i === page ? 'active' : ''}`}
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
                <div className="loading">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            ) : (
                <>
                    <ul>
                        {categorias.map(categoria => (
                            <li key={categoria.id}>{categoria.nome}</li>
                        ))}
                    </ul>
                    <div className="pagination-controls">
                        {renderPageNumbers()}
                    </div>
                </>
            )}
        </div>
    );
}

export default CategoriaList;
