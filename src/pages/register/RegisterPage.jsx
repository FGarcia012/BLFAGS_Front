import React from 'react';
import { Register } from '../../components/Register';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSwitchToLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="register-container">
      <Register switchAuthHandler={handleSwitchToLogin} />
    </div>
  );
};