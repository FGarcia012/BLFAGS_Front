import React, { useState, useEffect } from 'react';
import { Users, Search, Trash2, Eye, Shield, User, Mail, Calendar, AlertTriangle } from 'lucide-react';
import { getUsers, deleteUser, getUserById } from '../../services/api';
import './UserSettings.css';

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            
            if (response.success) {
                setUsers(response.users || []);
            } else {
                setMessage('❌ Error al cargar usuarios: ' + (response.message || ''));
            }
        } catch (error) {
            setMessage('❌ Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        if (!searchTerm.trim()) {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter(user => 
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setFilteredUsers(filtered);
    };

    const handleViewUser = async (userId) => {
        try {
            const response = await getUserById(userId);
            if (response.success) {
                setSelectedUser(response.user);
            }
        } catch (error) {
            setMessage('❌ Error al cargar detalles del usuario');
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete || isDeleting) return;

        setIsDeleting(true);
        try {
            const response = await deleteUser(userToDelete.uid);
            
            if (response.success) {
                setMessage('✓ Usuario eliminado correctamente');
                setUsers(prev => prev.map(user => 
                    user.uid === userToDelete.uid 
                        ? { ...user, status: false }
                        : user
                ));
                setShowDeleteModal(false);
                setUserToDelete(null);
            } else {
                setMessage('❌ ' + (response.message || 'Error al eliminar usuario'));
            }
        } catch (error) {
            setMessage('❌ Error al eliminar usuario');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    };

    const getRoleIcon = (role) => {
        return role === 'ADMIN' ? <Shield size={16} color="#dc2626" /> : <User size={16} color="#6b7280" />;
    };

    const getRoleBadge = (role) => (
        <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            background: role === 'ADMIN' ? '#fee2e2' : '#f3f4f6',
            color: role === 'ADMIN' ? '#dc2626' : '#6b7280'
        }}>
            {role}
        </span>
    );

    const getStatusBadge = (status) => (
        <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            background: status ? '#dcfce7' : '#fee2e2',
            color: status ? '#16a34a' : '#dc2626'
        }}>
            {status ? 'Activo' : 'Inactivo'}
        </span>
    );

    if (loading) {
        return (
            <div className="user-settings">
                <div className="settings-header">
                    <h2 className="settings-title">Gestión de Usuarios</h2>
                    <p className="settings-subtitle">Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-settings">
            <div className="settings-header">
                <h2 className="settings-title">
                    <Users size={24} />
                    Gestión de Usuarios
                </h2>
                <p className="settings-subtitle">
                    Administra los usuarios del sistema ({filteredUsers.length} usuarios)
                </p>
            </div>

            <div className="settings-content">
                {message && (
                    <div style={{
                        padding: '12px',
                        marginBottom: '16px',
                        borderRadius: '6px',
                        background: message.includes('✓') ? '#dcfce7' : '#fee2e2',
                        color: message.includes('✓') ? '#16a34a' : '#dc2626',
                        border: `1px solid ${message.includes('✓') ? '#bbf7d0' : '#fecaca'}`
                    }}>
                        {message}
                    </div>
                )}

                {/* Barra de búsqueda */}
                <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <Search size={20} style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6b7280'
                    }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, username, email o rol..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 44px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    />
                </div>

                {/* Lista de usuarios */}
                <div style={{ display: 'grid', gap: '12px' }}>
                    {filteredUsers.map((user) => (
                        <div key={user.uid} style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: '#f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {user.profilePicture ? (
                                        <img 
                                            src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:3020/${user.profilePicture}`}
                                            alt={user.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <User size={24} color="#9ca3af" />
                                    )}
                                </div>

                                {/* Info del usuario */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                                            {user.name}
                                        </h3>
                                        {getRoleIcon(user.role)}
                                        {getRoleBadge(user.role)}
                                        {getStatusBadge(user.status)}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                                        <span>@{user.username}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Mail size={14} />
                                            {user.email}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={14} />
                                            {formatDate(user.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleViewUser(user.uid)}
                                    style={{
                                        background: '#f3f4f6',
                                        border: 'none',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    title="Ver detalles"
                                >
                                    <Eye size={16} color="#6b7280" />
                                </button>
                                
                                {user.status && user.role !== 'ADMIN' && (
                                    <button
                                        onClick={() => handleDeleteClick(user)}
                                        style={{
                                            background: '#fee2e2',
                                            border: 'none',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        title="Desactivar usuario"
                                    >
                                        <Trash2 size={16} color="#dc2626" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {filteredUsers.length === 0 && !loading && (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#6b7280'
                        }}>
                            <Users size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                            <p>No se encontraron usuarios</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            {showDeleteModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '8px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '90%'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <AlertTriangle size={24} color="#dc2626" />
                            <h3 style={{ margin: 0, color: '#dc2626' }}>Confirmar Eliminación</h3>
                        </div>
                        
                        <p style={{ margin: '0 0 20px', color: '#6b7280' }}>
                            ¿Estás seguro de que quieres desactivar al usuario <strong>{userToDelete?.name}</strong>?
                            Esta acción marcará al usuario como inactivo.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setUserToDelete(null);
                                }}
                                disabled={isDeleting}
                                style={{
                                    background: '#f3f4f6',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                style={{
                                    background: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    cursor: isDeleting ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isDeleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de detalles del usuario */}
            {selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '8px',
                        padding: '24px',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>Detalles del Usuario</h3>
                            <button
                                onClick={() => setSelectedUser(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: '#f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 12px',
                                    overflow: 'hidden'
                                }}>
                                    {selectedUser.profilePicture ? (
                                        <img 
                                            src={selectedUser.profilePicture.startsWith('http') ? selectedUser.profilePicture : `http://localhost:3020/${selectedUser.profilePicture}`}
                                            alt={selectedUser.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <User size={32} color="#9ca3af" />
                                    )}
                                </div>
                                <h4 style={{ margin: '0 0 4px' }}>{selectedUser.name}</h4>
                                <p style={{ margin: 0, color: '#6b7280' }}>@{selectedUser.username}</p>
                            </div>
                            
                            <div style={{ display: 'grid', gap: '12px' }}>
                                <div>
                                    <strong>Email:</strong> {selectedUser.email}
                                </div>
                                <div>
                                    <strong>Rol:</strong> {getRoleBadge(selectedUser.role)}
                                </div>
                                <div>
                                    <strong>Estado:</strong> {getStatusBadge(selectedUser.status)}
                                </div>
                                <div>
                                    <strong>Fecha de registro:</strong> {formatDate(selectedUser.createdAt)}
                                </div>
                                <div>
                                    <strong>Última actualización:</strong> {formatDate(selectedUser.updatedAt)}
                                </div>
                                <div>
                                    <strong>ID:</strong> <code>{selectedUser.uid}</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
