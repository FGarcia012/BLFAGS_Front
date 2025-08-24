import React, { useState } from 'react';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { deletePublication } from '../../services/api';
import { useUser } from '../../contexts/UserContext';
import { usePublicationsRefresh } from '../../contexts/PublicationsRefreshContext';
import { canEditPublication, canDeletePublication } from '../../shared/utils/publicationPermissions';
import toast from 'react-hot-toast';
import './PublicationActions.css';

export const PublicationActions = ({ 
    publication, 
    onEdit, 
    onDelete, 
    className = '' 
}) => {
    const { user } = useUser();
    const { onPublicationDeleted } = usePublicationsRefresh();
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const canEdit = () => {
        return canEditPublication(user, publication);
    };

    const canDelete = () => {
        return canDeletePublication(user, publication);
    };

    const handleEdit = () => {
        setShowMenu(false);
        if (onEdit) {
            onEdit(publication);
        }
    };

    const handleDeleteClick = () => {
        setShowMenu(false);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            const publicationId = publication.pid || publication._id;
            const result = await deletePublication(publicationId);
            
            if (result.error) {
                toast.error(result.e?.response?.data?.message || 'Error al eliminar la publicación');
                return;
            }

            toast.success('Publicación eliminada exitosamente');
            
            if (onDelete) {
                onDelete(publication);
            }
            
            onPublicationDeleted();
        } catch (error) {
            console.error('Error deleting publication:', error);
            toast.error('Error al eliminar la publicación');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    if (!canEdit() && !canDelete()) {
        return null;
    }

    return (
        <div className={`publication-actions ${className}`}>
            <button
                className="actions-trigger"
                onClick={() => setShowMenu(!showMenu)}
                title="Más opciones"
            >
                <MoreVertical size={20} />
            </button>

            {showMenu && (
                <div className="actions-menu">
                    {canEdit() && (
                        <button
                            className="action-item edit-action"
                            onClick={handleEdit}
                        >
                            <Edit size={16} />
                            Editar
                        </button>
                    )}
                    {canDelete() && (
                        <button
                            className="action-item delete-action"
                            onClick={handleDeleteClick}
                        >
                            <Trash2 size={16} />
                            Eliminar
                        </button>
                    )}
                </div>
            )}

            {showDeleteConfirm && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-modal">
                        <h3>Confirmar eliminación</h3>
                        <p>¿Estás seguro de que deseas eliminar esta publicación?</p>
                        <p className="warning-text">Esta acción no se puede deshacer.</p>
                        
                        <div className="confirm-actions">
                            <button
                                className="cancel-button"
                                onClick={handleDeleteCancel}
                                disabled={isDeleting}
                            >
                                Cancelar
                            </button>
                            <button
                                className="confirm-delete-button"
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMenu && (
                <div 
                    className="menu-overlay"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
};
