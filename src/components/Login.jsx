import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  validateEmail,
} from '../shared/validators';
import { useLogin } from '../shared/hooks/useLogin';
import { BackButton } from './BackButton/BackButton';

const shootingStarColors = ["#1e40af", "#3b82f6", "#60a5fa"];
const particleColors = ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd"];

const shootingStarVariants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  visible: (custom) => ({
    opacity: [0, 1, 0],
    x: [0, 120 + custom * 60],
    y: [0, 40 * (custom % 2 === 0 ? 1 : -1), 0],
    transition: {
      duration: 1.5,
      delay: custom * 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};

const particleVariants = {
  animate: {
    opacity: [0.3, 0.8, 0.3],
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const Login = ({ switchAuthHandler }) => {
  const { loginUser, isLoading } = useLogin();
  const particlesArray = Array(50).fill(0);

  const [formState, setFormState] = useState({
    emailOrUsername: { value: '', isValid: false, showError: false, isFocused: false },
    password: { value: '', isValid: false, showError: false, isFocused: false },
  });

  const [clickedLogin, setClickedLogin] = useState(false);

  const handleInputValueChange = (value, field) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: { 
        ...prevState[field], 
        value,
        showError: false
      },
    }));
  };

  const handleInputFocus = (field) => {
    setFormState(prev => ({
      ...prev,
      [field]: { ...prev[field], isFocused: true }
    }));
  };

  const handleInputBlur = (field) => {
    setFormState(prev => ({
      ...prev,
      [field]: { ...prev[field], isFocused: false }
    }));

    handleInputValidationOnBlur(formState[field].value, field);
  };

  const handleInputValidationOnBlur = (value, field) => {
    let isValid = false;
    switch (field) {
      case 'emailOrUsername':
        isValid = validateEmail(value) || value.length >= 3;
        break;
      case 'password':
        isValid = value.length >= 1;
        break;
      default:
        break;
    }
    setFormState((prevState) => ({
      ...prevState,
      [field]: { ...prevState[field], isValid, showError: !isValid },
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    setClickedLogin(true);
    
    const emailOrUsernameValue = formState.emailOrUsername.value;
    const passwordValue = formState.password.value;

    if (!emailOrUsernameValue || !passwordValue) {
      setFormState(prev => ({
        ...prev,
        emailOrUsername: {
          ...prev.emailOrUsername,
          showError: !emailOrUsernameValue,
          isValid: !!emailOrUsernameValue
        },
        password: {
          ...prev.password,
          showError: !passwordValue,
          isValid: !!passwordValue
        }
      }));
      setClickedLogin(false);
      return;
    }

    const isEmail = validateEmail(emailOrUsernameValue);
    const loginData = {
      password: passwordValue
    };

    if (isEmail) {
      loginData.email = emailOrUsernameValue;
    } else {
      loginData.username = emailOrUsernameValue;
    }

    try {
      await loginUser(loginData);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setClickedLogin(false);
    }
  };

  const isSubmitDisabled = isLoading || !formState.emailOrUsername.value || !formState.password.value;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Botón de volver al inicio */}
      <div className="absolute top-6 left-6 z-20">
        <BackButton 
          to="/" 
          text="Volver al Inicio" 
          icon="home" 
          variant="outline"
        />
      </div>

      {/* Partículas animadas */}
      {particlesArray.map((_, i) => {
        const size = Math.random() * 3 + 1;
        const color = particleColors[i % particleColors.length];
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              backgroundColor: color,
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
            variants={particleVariants}
            animate="animate"
            initial={{ opacity: 0.3, y: 0 }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        );
      })}

      {/* Estrellas fugaces */}
      {[...Array(15)].map((_, i) => {
        const color = shootingStarColors[i % shootingStarColors.length];
        return (
          <motion.div
            key={`shooting-star-${i}`}
            custom={i}
            className="absolute rounded-lg blur-sm"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 50}%`,
              width: 6 + Math.random() * 10,
              height: 1.5 + Math.random() * 2,
              rotate: 45,
              backgroundColor: color,
              opacity: 0,
              filter: `drop-shadow(0 0 12px ${color})`,
            }}
            variants={shootingStarVariants}
            initial="hidden"
            animate="visible"
          />
        );
      })}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white rounded-lg shadow-2xl p-10 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
          <p className="text-gray-600 text-sm">Accede a tu cuenta BLFAGS</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Campo Username */}
          <div className="relative">
            <input
              type="text"
              value={formState.emailOrUsername.value}
              onChange={(e) => handleInputValueChange(e.target.value, 'emailOrUsername')}
              onFocus={() => handleInputFocus('emailOrUsername')}
              onBlur={() => handleInputBlur('emailOrUsername')}
              className={`w-full px-4 py-4 border-2 rounded-lg focus:outline-none transition-all duration-300 placeholder-gray-500 ${
                formState.emailOrUsername.showError 
                  ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
              }`}
              placeholder="Email o nombre de usuario"
            />
            {formState.emailOrUsername.showError && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-500 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Ingresa un email válido o nombre de usuario
              </motion.p>
            )}
          </div>

          {/* Campo Password */}
          <div className="relative">
            <input
              type="password"
              value={formState.password.value}
              onChange={(e) => handleInputValueChange(e.target.value, 'password')}
              onFocus={() => handleInputFocus('password')}
              onBlur={() => handleInputBlur('password')}
              className={`w-full px-4 py-4 border-2 rounded-lg focus:outline-none transition-all duration-300 placeholder-gray-500 ${
                formState.password.showError 
                  ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
              }`}
              placeholder="Contraseña"
            />
            {formState.password.showError && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-500 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                La contraseña es requerida
              </motion.p>
            )}
          </div>

          {/* Botón Login */}
          <motion.button
            type="submit"
            disabled={isSubmitDisabled}
            whileHover={!isSubmitDisabled ? { scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 ${
              isSubmitDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Iniciando sesión...</span>
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </motion.button>
        </form>

        {/* Enlace de registro */}
        <div className="mt-8 text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">o</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              onClick={switchAuthHandler}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              Crear cuenta
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

Login.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired,
};