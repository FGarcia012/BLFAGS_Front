import axios from 'axios';

const apiClient = axios.create({
    baseURL: "https://blfags-back.vercel.app/BLFAGS/v1/",
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

export const addComments = async (data) => {
    try {
        const response = await apiClient.post(`/comment/addComment`, data);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const addReaction = async (id, data) => {
    try {
        const response = await apiClient.post(`/reactions/addOrUpdateReaction/${id}`, data);
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

export const deleteReaction = async (id) => {
    try {
        const response = await apiClient.delete(`/reactions/removeReaction/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getPublicationReactions = async (id) => {
    try {
        const response = await apiClient.get(`/reactions/getPublicationReactions/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getUserReaction = async (id) => {
    try {
        const response = await apiClient.get(`/reactions/getUserReaction/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const deleteComment = async (id) => {
    try {
        const response = await apiClient.delete(`/comment/deleteComment/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const deleteHashtag = async (id) => {
    try {
        const response = await apiClient.delete(`/hashtag/deleteHashtag/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getPublications = async (searchTerm = '') => {
    try {
        const publicationsClient = axios.create({
            baseURL: "https://blfags-back.vercel.app/BLFAGS/v1/",
            timeout: 30000,
        });

        const userDetails = localStorage.getItem("user");
        const headers = {};
        
        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                if (parsedUser?.token) {
                    headers.Authorization = `Bearer ${parsedUser.token}`;
                }
            } catch (err) {
                console.warn("Error al leer el token:", err);
            }
        }

        const url = searchTerm 
            ? `/publication/getPublications?search=${encodeURIComponent(searchTerm)}`
            : `/publication/getPublications`;
            
        const response = await publicationsClient.get(url, { headers });
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getComments = async () => {
    try {
        const response = await apiClient.get(`/comment/getComments`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const fetchHashtags = async () => {
    try {
        const response = await apiClient.get(`/hashtag/getHashtags`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getHashtagById = async (id) => {
    try {
        const response = await apiClient.get(`/hashtag/getHashtag/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const searchHashtags = async (query) => {
    try {
    const API_BASE = "https://blfags-back.vercel.app/BLFAGS/v1";
    const res = await fetch(`${API_BASE}/hashtag/search?query=${encodeURIComponent(query)}`);
        if (!res.ok) {
            return { publications: [] };
        }
        return res.json();
    } catch (error) {
        return {
        error: true,
        e: error
        };
    }
};

export const fetchPublicationsByHashtag = async (name) => {
  try {
    const API_BASE = "https://blfags-back.vercel.app/BLFAGS/v1";
    const res = await fetch(`${API_BASE}/hashtag/publications/${encodeURIComponent(name)}`);
    if (!res.ok) {
      return { publications: [] };
    }
    return res.json();
  } catch (error) {
      return {
            error: true,
            e
        }
  }
};

export const getCommentsById = async (id) => {
    try {
        const response = await apiClient.get(`/comment/getComment/${id}`);
        return response.data;
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getCommentsByPublication = async (id) => {
    try {
        const response = await apiClient.get(`/comment/publication/${id}`);
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