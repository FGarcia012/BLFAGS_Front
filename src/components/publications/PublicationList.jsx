import React, { useState } from "react";
import { PublicationCard } from "./PublicationCard";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

export const PublicationList = ({ 
  publications = [], 
  isLoading = false, 
  error = null,
  onRefresh = null 
}) => {
  const [selectedPublication, setSelectedPublication] = useState(null);

  const handlePublicationSelect = (publication) => {
    setSelectedPublication(
      selectedPublication?.pid === publication.pid ? null : publication
    );
  };

  if (isLoading) {
    return (
      <div className="publications-loading">
        <LoadingSpinner />
        <p>Cargando publicaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="publications-error">
        <div className="error-content">
          <h3>Error al cargar las publicaciones</h3>
          <p>{error}</p>
          {onRefresh && (
            <button className="retry-button" onClick={onRefresh}>
              Intentar de nuevo
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!publications || publications.length === 0) {
    return (
      <div className="publications-empty">
        <div className="empty-content">
          <h3>No hay publicaciones disponibles</h3>
          <p>Aún no se han creado publicaciones o no tienes permisos para verlas.</p>
          {onRefresh && (
            <button className="refresh-button" onClick={onRefresh}>
              Actualizar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="publications-container">
      <div className="publications-header">
        <h2>Publicaciones</h2>
        <div className="publications-count">
          {publications.length} {publications.length === 1 ? 'publicación' : 'publicaciones'}
        </div>
        {onRefresh && (
          <button className="refresh-button" onClick={onRefresh}>
            🔄 Actualizar
          </button>
        )}
      </div>

      <div className="publications-list">
        {publications.map((publication) => (
          <PublicationCard
            key={publication._id || publication.pid}
            publication={publication}
            onSelect={handlePublicationSelect}
            isSelected={selectedPublication?._id === publication._id || selectedPublication?.pid === publication.pid}
          />
        ))}
      </div>

      {selectedPublication && (
        <div className="publication-details-overlay" onClick={() => setSelectedPublication(null)}>
          <div className="publication-details" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-details"
              onClick={() => setSelectedPublication(null)}
            >
              ✕
            </button>
            <PublicationCard
              publication={selectedPublication}
              isSelected={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
