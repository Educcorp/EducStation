// src/components/common/SearchComponent.jsx
import React, { useState, useEffect } from 'react';
import { simpleSearch, advancedSearch, getTrendingTags } from '../../services/searchService';

const SearchComponent = () => {
    // Estados para búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para búsqueda avanzada
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [status, setStatus] = useState('publicado');
    const [orderBy, setOrderBy] = useState('Fecha_creacion');
    const [orderDir, setOrderDir] = useState('desc');

    // Cargar categorías al inicio
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await getTrendingTags();
                if (response && response.status === 'success') {
                    setCategories(response.results || []);
                }
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        };

        loadCategories();
    }, []);

    // Función para búsqueda simple
    const handleSimpleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await simpleSearch(searchTerm);
            if (response && response.status === 'success') {
                setResults(response.results || []);
            } else {
                setError('Error en la respuesta del servidor');
            }
        } catch (error) {
            setError('Error al realizar la búsqueda');
        } finally {
            setLoading(false);
        }
    };

    // Función para búsqueda avanzada
    const handleAdvancedSearch = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const searchParams = {
                term: searchTerm,
                categorias: selectedCategories,
                fechaDesde: dateFrom || null,
                fechaHasta: dateTo || null,
                estado: status,
                orderBy,
                orderDir,
                limit: 10,
                page: 1
            };

            const response = await advancedSearch(searchParams);
            if (response && response.status === 'success') {
                setResults(response.results || []);
            } else {
                setError('Error en la respuesta del servidor');
            }
        } catch (error) {
            setError('Error al realizar la búsqueda avanzada');
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambio en selección de categorías
    const handleCategoryChange = (e) => {
        const categoryId = parseInt(e.target.value);
        if (e.target.checked) {
            setSelectedCategories([...selectedCategories, categoryId]);
        } else {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        }
    };

    return (
        <div className="search-container">
            <h2>Búsqueda de Contenidos</h2>

            {/* Formulario de búsqueda simple */}
            <form onSubmit={handleSimpleSearch} className="search-form">
                <div className="search-input-container">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar..."
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Buscar</button>
                </div>
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="toggle-advanced"
                >
                    {showAdvanced ? 'Ocultar búsqueda avanzada' : 'Mostrar búsqueda avanzada'}
                </button>
            </form>

            {/* Formulario de búsqueda avanzada */}
            {showAdvanced && (
                <form onSubmit={handleAdvancedSearch} className="advanced-search-form">
                    <h3>Búsqueda Avanzada</h3>

                    {/* Categorías */}
                    <div className="form-group">
                        <label>Categorías:</label>
                        <div className="categories-container">
                            {categories.map(category => (
                                <div key={category.ID_categoria} className="category-checkbox">
                                    <input
                                        type="checkbox"
                                        id={`cat-${category.ID_categoria}`}
                                        value={category.ID_categoria}
                                        onChange={handleCategoryChange}
                                        checked={selectedCategories.includes(category.ID_categoria)}
                                    />
                                    <label htmlFor={`cat-${category.ID_categoria}`}>{category.Nombre_categoria}</label>
                                </div>
                            ))}
                            {categories.length === 0 && <p>Cargando categorías...</p>}
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Desde:</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Hasta:</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Estado y ordenamiento */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Estado:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="publicado">Publicado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Ordenar por:</label>
                            <select
                                value={orderBy}
                                onChange={(e) => setOrderBy(e.target.value)}
                            >
                                <option value="Fecha_creacion">Fecha de creación</option>
                                <option value="Titulo">Título</option>
                                <option value="Fecha_modificacion">Fecha de modificación</option>
                            </select>

                            <select
                                value={orderDir}
                                onChange={(e) => setOrderDir(e.target.value)}
                            >
                                <option value="desc">Descendente</option>
                                <option value="asc">Ascendente</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="advanced-search-button">Buscar</button>
                </form>
            )}

            {/* Mensaje de carga o error */}
            {loading && <p className="loading-message">Cargando resultados...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Resultados */}
            {!loading && !error && (
                <div className="search-results">
                    <h3>Resultados ({results.length})</h3>
                    {results.length > 0 ? (
                        <div className="results-list">
                            {results.map(item => (
                                <div key={item.ID_publicaciones} className="result-item">
                                    <h4>{item.Titulo}</h4>
                                    <p>{item.Resumen || (item.Contenido && item.Contenido.substring(0, 100) + '...')}</p>
                                    <div className="result-meta">
                                        <span className="result-date">
                                            Fecha: {new Date(item.Fecha_creacion).toLocaleDateString()}
                                        </span>
                                        {item.NombreAdmin && (
                                            <span className="result-author">
                                                Autor: {item.NombreAdmin}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-results">No se encontraron resultados</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchComponent;