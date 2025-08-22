import { useState, useEffect } from 'react';
import { 
    getCommentsByPublication, 
    addComments, 
    deleteComment 
} from '../../services/api';
import { useUser } from '../../contexts/UserContext';

export const useComments = (publicationId) => {
    const { user } = useUser();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadComments = async () => {
        if (!publicationId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getCommentsByPublication(publicationId);
            
            if (response.success) {
                setComments(response.comments || []);
            } else {
                if (response.e?.response?.status === 404) {
                    setComments([]);
                } else {
                    throw new Error(response.e?.response?.data?.message || 'Error al cargar comentarios');
                }
            }
        } catch (err) {
            setError(err.message || 'Error al cargar los comentarios');
            console.error('Error al cargar comentarios:', err);
        } finally {
            setLoading(false);
        }
    };

    const addComment = async (commentData) => {
        if (!user) {
            throw new Error('Debes iniciar sesión para comentar');
        }

        setSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('text', commentData.text || '');
            formData.append('publication', publicationId);
            formData.append('user', user.uid);
            
            if (commentData.media) {
                formData.append('media', commentData.media);
            }

            const response = await addComments(formData);
            
            if (response.success) {
                setComments(prevComments => [response.comment, ...prevComments]);
                return response.comment;
            } else {
                throw new Error(response.e?.response?.data?.message || 'Error al agregar comentario');
            }
        } catch (err) {
            const errorMessage = err.message || 'Error al agregar el comentario';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const removeComment = async (commentId) => {
        if (!user) {
            throw new Error('Debes iniciar sesión para eliminar comentarios');
        }

        try {
            const response = await deleteComment(commentId);
            
            if (response.success) {
                setComments(prevComments => 
                    prevComments.filter(comment => comment.cid !== commentId)
                );
                return true;
            } else {
                throw new Error(response.e?.response?.data?.message || 'Error al eliminar comentario');
            }
        } catch (err) {
            const errorMessage = err.message || 'Error al eliminar el comentario';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const canDeleteComment = (comment) => {
        if (!user || !comment) return false;
        
        return (
            user.uid === comment.user._id || 
            user.uid === comment.user.uid ||
            user.role === 'ADMIN'
        );
    };

    const canAddComment = (publication) => {
        if (!user) return false;
        
        if (user.role === 'ADMIN') return true;
        
        if (publication?.visibility === 'public') return true;
        
        if (publication?.user?._id === user.uid || publication?.user?.uid === user.uid) return true;
        
        return false;
    };

    const refreshComments = () => {
        loadComments();
    };

    useEffect(() => {
        loadComments();
    }, [publicationId]);

    return {
        comments,
        loading,
        error,
        submitting,
        addComment,
        removeComment,
        canDeleteComment,
        canAddComment,
        refreshComments,
        commentsCount: comments.length
    };
};
