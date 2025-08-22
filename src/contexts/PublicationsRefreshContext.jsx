import React, { createContext, useContext, useState, useCallback } from 'react';

const PublicationsRefreshContext = createContext();

export const usePublicationsRefresh = () => {
  const context = useContext(PublicationsRefreshContext);
  if (!context) {
    throw new Error('usePublicationsRefresh must be used within a PublicationsRefreshProvider');
  }
  return context;
};

export const PublicationsRefreshProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [subscribers, setSubscribers] = useState([]);

  const subscribe = useCallback((callback) => {
    setSubscribers(prev => [...prev, callback]);
    
    return () => {
      setSubscribers(prev => prev.filter(cb => cb !== callback));
    };
  }, []);

  const triggerGlobalRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    
    subscribers.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in refresh subscriber:', error);
      }
    });
  }, [subscribers]);

  const onPublicationAdded = useCallback(() => {
    console.log('📝 Nueva publicación agregada - actualizando listas...');
    triggerGlobalRefresh();
  }, [triggerGlobalRefresh]);

  const onPublicationUpdated = useCallback(() => {
    console.log('✏️ Publicación actualizada - actualizando listas...');
    triggerGlobalRefresh();
  }, [triggerGlobalRefresh]);

  const onPublicationDeleted = useCallback(() => {
    console.log('🗑️ Publicación eliminada - actualizando listas...');
    triggerGlobalRefresh();
  }, [triggerGlobalRefresh]);

  const value = {
    refreshTrigger,
    subscribe,
    triggerGlobalRefresh,
    onPublicationAdded,
    onPublicationUpdated,
    onPublicationDeleted
  };

  return (
    <PublicationsRefreshContext.Provider value={value}>
      {children}
    </PublicationsRefreshContext.Provider>
  );
};
