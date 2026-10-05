import axios from 'axios';
import toast from 'react-hot-toast';
export const apiClient = axios.create({baseURL:import.meta.env.VITE_API_URL || 'https://blfags-back.vercel.app/BLFAGS/v1/',timeout:30000});
apiClient.interceptors.request.use(config => {
 try {const token = JSON.parse(localStorage.getItem('user'))?.token; if (token) config.headers.Authorization = `Bearer ${token}`;} catch {localStorage.removeItem('user');}
 return config;
});
apiClient.interceptors.response.use(response => response,error => {
 if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
  localStorage.removeItem('user'); window.dispatchEvent(new Event('session-expired')); toast.error('Tu sesión expiró');
  if (window.location.pathname !== '/auth') window.location.assign('/auth');
 }
 return Promise.reject(error);
});
export const getErrorMessage = error => error?.response?.data?.message || 'No se pudo completar la solicitud';
const get = (path,params = {},signal) => apiClient.get(path,{params,signal}).then(r => r.data);
export const register = data => apiClient.post('/auth/register',data);
export const login = data => apiClient.post('/auth/login',data);
export const getPublications = (search = '',options = {}) => get('/publication/getPublications',{search:search || undefined,limit:20,cursor:options.cursor,filter:options.filter},options.signal);
export const getPublicationsByUser = (uid,options = {}) => get(`/publication/user/${uid}`,{limit:20,cursor:options.cursor},options.signal);
export const getPublicationById = (pid,signal) => get(`/publication/getPublication/${pid}`,{},signal);
export const addPublications = data => apiClient.post('/publication/addPublication',data).then(r => r.data);
export const updatePublication = (pid,data) => apiClient.put(`/publication/updatePublication/${pid}`,data).then(r => r.data);
export const deletePublication = pid => apiClient.delete(`/publication/deletePublication/${pid}`).then(r => r.data);
export const addReaction = (pid,data) => apiClient.post(`/reactions/addOrUpdateReaction/${pid}`,data).then(r => r.data);
export const deleteReaction = pid => apiClient.delete(`/reactions/removeReaction/${pid}`).then(r => r.data);
export const getPublicationReactions = pid => get(`/reactions/getPublicationReactions/${pid}`);
export const getUserReaction = pid => get(`/reactions/getUserReaction/${pid}`);
export const getCommentsByPublication = (pid,options = {}) => get(`/comment/publication/${pid}`,{limit:20,cursor:options.cursor},options.signal);
export const addComments = data => apiClient.post('/comment/addComment',data).then(r => r.data);
export const deleteComment = cid => apiClient.delete(`/comment/deleteComment/${cid}`).then(r => r.data);
export const getCommentsById = cid => get(`/comment/getComment/${cid}`);
export const getComments = () => get('/comment/getComments');
export const fetchHashtags = signal => get('/hashtag/getHashtags',{},signal);
export const searchHashtags = (query,signal) => get('/hashtag/search',{query},signal);
export const fetchPublicationsByHashtag = (name,options = {}) => get(`/hashtag/publications/${encodeURIComponent(name)}`,{limit:20,cursor:options.cursor},options.signal);
export const getHashtagById = id => get(`/hashtag/getHashtag/${id}`);
export const deleteHashtag = hid => apiClient.delete(`/hashtag/deleteHashtag/${hid}`).then(r => r.data);
export const getUserById = (uid,signal) => get(`/user/getUser/${uid}`,{},signal);
export const getUsers = signal => get('/user/getUsers',{},signal);
export const updateUser = (uid,data) => apiClient.put(`/user/updateUser/${uid}`,data).then(r => r.data);
export const updatePassword = (uid,data) => apiClient.put(`/user/updatePassword/${uid}`,data).then(r => r.data);
export const updateProfilePicture = (uid,data) => apiClient.patch(`/user/updateProfilePicture/${uid}`,data).then(r => r.data);
export const deleteUser = (uid,data = {confirm:'Si'}) => apiClient.delete(`/user/deleteUser/${uid}`,{data}).then(r => r.data);
