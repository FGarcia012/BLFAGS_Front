import axios from 'axios';

const apiClient = axios.create({
    baseURL: "http://localhost:3020/BLFAGS/v1/",
    timeout: 30000,
    httpsAgent: false
});

apiClient.interceptors.request.use(
    (config) => {
        const userDetails = localStorage.getItem("user");

        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                if (parsedUser?.token) {
                    config.headers.Authorization = `Bearer ${parsedUser.token}`;
                }
            } catch (err) {
                console.warn("Error al leer el token:", err);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const register = async (data) => {
    try {
        return await apiClient.post('/auth/register', data)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const login = async (data) => {
    return await apiClient.post('/auth/login', data);
};

export const addPublications = async (data) => {
    try {
        const response = await apiClient.post(`/publication/addPublication`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updatePublication = async (id, data) => {
    try {
        const response = await apiClient.put(`/publication/updatePublication/${id}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const deletePublication = async (id) => {
    try {
        const response = await apiClient.delete(`/publication/deletePublication/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getPublications = async () => {
    try {
        const response = await apiClient.get(`/publication/getPublications`)
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getPublicationById = async (id) => {
    try {
        const response = await apiClient.get(`/publication/getPublication/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getPublicationsByUser = async (id) => {
    try {
        const response = await apiClient.get(`/publication/user/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updateUser = async (id, data) => {
    try {
        const response = await apiClient.put(`/user/updateUser/${id}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updatePassword = async (id, data) => {
    try {
        const response = await apiClient.put(`/user/updatePassword/${id}`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const updateProfilePicture = async (id, formData) => {
    try {
        const response = await apiClient.patch(`/user/updateProfilePicture/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (e) {
        return {
            error: true,
            message: e.response?.data?.message || 'Error al actualizar la foto de perfil',
            e
        }
    }
}

// Solo el administrador puede acceder
export const getUsers = async () => {
    try {
        const response = await apiClient.get(`/user/getUsers`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        };
    }
}

export const getUserById = async (id) => {
    try {
        const response = await apiClient.get(`/user/getUser/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const deleteUser = async (id, confirmationData = null) => {
    try {
        const response = await apiClient.delete(`/user/deleteUser/${id}`, {
            data: confirmationData || { confirm: "Si" }
        });
        
        return response.data;
    } catch (e) {
        return {
            error: true,
            message: e.response?.data?.message || 'Error al eliminar usuario',
            e
        }
    }
}

export const getUserStats = async (id) => {
    try {
        const userResponse = await apiClient.get(`/user/getUser/${id}`);
        
        let publications = [];
        try {
            const publicationsResponse = await apiClient.get(`/publication/user/${id}`);
            publications = publicationsResponse.data.publications || [];
        } catch (publicationError) {
            console.log('Usuario sin publicaciones o error al obtenerlas:', publicationError.response?.status);
            publications = [];
        }
        
        const user = userResponse.data.user;
        
        const totalLikes = publications.reduce((total, pub) => {
            return total + (pub.reactionCount?.total || 0);
        }, 0);
        
        return {
            success: true,
            user,
            stats: {
                totalPublications: publications.length,
                totalLikes,
                publications
            }
        };
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}