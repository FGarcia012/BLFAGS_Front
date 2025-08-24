import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import './PublicationSearch.css';

export const PublicationSearch = ({ 
    onSearch, 
    isLoading = false, 
    initialValue = '',
    placeholder = "Buscar publicaciones por título..." 
}) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            onSearch(searchTerm);
        }, 500);

        setDebounceTimeout(timeout);

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [searchTerm]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        onSearch('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className="publication-search">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-container">
                    <Search 
                        className={`search-icon ${isLoading ? 'loading' : ''}`} 
                        size={20} 
                    />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className="search-input"
                        disabled={isLoading}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="clear-search-btn"
                            disabled={isLoading}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </form>
            {searchTerm && (
                <div className="search-info">
                    <span className="search-term">
                        Buscando: "<strong>{searchTerm}</strong>"
                    </span>
                </div>
            )}
        </div>
    );
};
