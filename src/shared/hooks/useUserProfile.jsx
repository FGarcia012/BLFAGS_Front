import { useState, useEffect } from 'react';
import { getUserStats } from '../../services/api';

export const useUserProfile = (userId) => {
    const [userProfile, setUserProfile] = useState(null);
    const [stats, setStats] = useState({
        totalPublications: 0,
        totalLikes: 0,
        publications: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCurrentUser = () => {
        try {
            const userDetails = localStorage.getItem("user");
            if (userDetails) {
                const parsedUser = JSON.parse(userDetails);
                return parsedUser;
            }
        } catch (err) {
            console.warn("Error al leer datos del usuario:", err);
        }
        return null;
    };

    const fetchUserProfile = async () => {
        const currentUser = getCurrentUser();
        const targetUserId = userId || currentUser?._id || currentUser?.uid;
        
        if (!targetUserId) {
            setError('No se pudo obtener el ID del usuario');
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            const response = await getUserStats(targetUserId);
            
            if (response.error) {
                throw new Error(response.e?.response?.data?.message || 'Usuario no encontrado');
            }
            
            setUserProfile(response.user);
            setStats(response.stats || {
                totalPublications: 0,
                totalLikes: 0,
                publications: []
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [userId]);

    const refreshProfile = () => {
        fetchUserProfile();
    };

    return {
        userProfile,
        stats,
        loading,
        error,
        refreshProfile
    };
};
