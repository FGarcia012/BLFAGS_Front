import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Login } from '../../components/Login';
import { Register } from '../../components/Register';

export const AuthPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode");

  const [isLogin, setIsLogin] = useState(() => mode !== "register");

  const handleAuthToggle = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <Login switchAuthHandler={handleAuthToggle} />
      ) : (
        <Register switchAuthHandler={handleAuthToggle} />
      )}
    </div>
  );
};