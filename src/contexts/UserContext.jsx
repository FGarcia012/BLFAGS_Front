import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getUserFromStorage = () => {
    try {
      const userDetails = localStorage.getItem("user");
      if (userDetails) {
        const userData = JSON.parse(userDetails);
        return {
          uid: userData.uid || userData._id || userData.user?.uid || userData.user?._id,
          username: userData.username || userData.user?.username || 'Usuario',
          name: userData.name || userData.user?.name || userData.username || userData.user?.username || 'Usuario',
          email: userData.email || userData.user?.email,
          profilePicture: userData.profilePicture || userData.user?.profilePicture,
          token: userData.token,
          role: userData.role || userData.user?.role
        };
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return null;
  };

  const updateUserData = (newUserData, showSuccessMessage = true) => {
    try {
      const currentUserDetails = localStorage.getItem("user");
      if (currentUserDetails) {
        const currentUser = JSON.parse(currentUserDetails);
        
        const updatedUser = {
          ...currentUser,
          ...newUserData,
          user: currentUser.user ? {
            ...currentUser.user,
            ...newUserData
          } : undefined
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        const formattedUser = {
          uid: updatedUser.uid || updatedUser._id || updatedUser.user?.uid || updatedUser.user?._id,
          username: updatedUser.username || updatedUser.user?.username || 'Usuario',
          name: updatedUser.name || updatedUser.user?.name || updatedUser.username || updatedUser.user?.username || 'Usuario',
          email: updatedUser.email || updatedUser.user?.email,
          profilePicture: updatedUser.profilePicture || updatedUser.user?.profilePicture,
          token: updatedUser.token,
          role: updatedUser.role || updatedUser.user?.role
        };
        
        setUser(formattedUser);
        
        if (showSuccessMessage) {
          toast.success('Perfil actualizado correctamente');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      if (showSuccessMessage) {
        toast.error('Error al actualizar el perfil');
      }
    }
    return false;
  };

  const login = (userData) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      const formattedUser = {
        uid: userData.uid || userData._id || userData.user?.uid || userData.user?._id,
        username: userData.username || userData.user?.username || 'Usuario',
        name: userData.name || userData.user?.name || userData.username || userData.user?.username || 'Usuario',
        email: userData.email || userData.user?.email,
        profilePicture: userData.profilePicture || userData.user?.profilePicture,
        token: userData.token,
        role: userData.role || userData.user?.role
      };
      setUser(formattedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const name = user.name || user.username || 'Usuario';
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const userData = getUserFromStorage();
    if (userData && userData.token) {
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          const userData = getUserFromStorage();
          if (userData && userData.token) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUserData,
    getUserInitials,
    refreshUser: () => {
      const userData = getUserFromStorage();
      if (userData && userData.token) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
