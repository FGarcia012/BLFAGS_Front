import React, { createContext, useContext, useState, useCallback } from 'react';

const CommentsRefreshContext = createContext();

export const useCommentsRefresh = () => {
    const context = useContext(CommentsRefreshContext);
    if (!context) {
        throw new Error('useCommentsRefresh debe ser usado dentro de CommentsRefreshProvider');
    }
    return context;
};

export const CommentsRefreshProvider = ({ children }) => {
    const [refreshTriggers, setRefreshTriggers] = useState({});

    const triggerCommentsRefresh = useCallback((publicationId) => {
        setRefreshTriggers(prev => ({
            ...prev,
            [publicationId]: (prev[publicationId] || 0) + 1
        }));
    }, []);

    const triggerGlobalCommentsRefresh = useCallback(() => {
        setRefreshTriggers(prev => {
            const newTriggers = {};
            Object.keys(prev).forEach(key => {
                newTriggers[key] = (prev[key] || 0) + 1;
            });
            return newTriggers;
        });
    }, []);

    const getRefreshTrigger = useCallback((publicationId) => {
        return refreshTriggers[publicationId] || 0;
    }, [refreshTriggers]);

    const registerPublication = useCallback((publicationId) => {
        setRefreshTriggers(prev => ({
            ...prev,
            [publicationId]: prev[publicationId] || 0
        }));
    }, []);

    const value = {
        triggerCommentsRefresh,
        triggerGlobalCommentsRefresh,
        getRefreshTrigger,
        registerPublication
    };

    return (
        <CommentsRefreshContext.Provider value={value}>
            {children}
        </CommentsRefreshContext.Provider>
    );
};
