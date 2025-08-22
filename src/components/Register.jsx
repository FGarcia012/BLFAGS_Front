import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useRegister } from "../shared/hooks/useRegister";
import {
  validateEmail,
  validateName,
  validateUsername,
  validatePassword,
  validateEmailMessage,
  validateNameMessage,
  validateUsernameMessage,
  validatePasswordMessage
} from "../shared/validators";
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

export const Register = ({ switchAuthHandler }) => {
  const { registerUser, isLoading } = useRegister();
  const fileInputRef = useRef(null);
  const particlesArray = Array(50).fill(0);

  const [formState, setFormState] = useState({
    name: { value: "", isValid: false, showError: false, isFocused: false },
    username: { value: "", isValid: false, showError: false, isFocused: false },
    email: { value: "", isValid: false, showError: false, isFocused: false },
    password: { value: "", isValid: false, showError: false, isFocused: false },
    profilePicture: { value: null, isValid: true, showError: false }
  });

  const [clickedRegister, setClickedRegister] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputValueChange = (value, field) => {
    setFormState(prev => ({
      ...prev,
      [field]: { 
        ...prev[field], 
        value,
        showError: false 
      }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("El archivo es muy grande. Máximo 5MB.");
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert("Solo se permiten archivos JPG, JPEG y PNG.");
        return;
      }

      setFormState(prev => ({
        ...prev,
        profilePicture: { 
          ...prev.profilePicture, 
          value: file 
        }
      }));

      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case "name":
        return validateName(value);
      case "username":
        return validateUsername(value);
      case "email":
        return validateEmail(value);
      case "password":
        const result = validatePassword(value);
        return result.isValid;
      default:
        return true;
    }
  };

  const getValidationMessage = (field) => {
    switch (field) {
      case "name":
        return validateNameMessage;
      case "username":
        return validateUsernameMessage;
      case "email":
        return validateEmailMessage;
      case "password":
        return validatePasswordMessage;
      default:
        return "Este campo es requerido";
    }
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
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setClickedRegister(true);
    
    const updatedState = { ...formState };
    let formIsValid = true;

    const requiredFields = ["name", "username", "email", "password"];
    
    requiredFields.forEach(field => {
      const isValid = validateField(field, updatedState[field].value);
      updatedState[field] = {
        ...updatedState[field],
        isValid,
        showError: !isValid
      };
      if (!isValid) formIsValid = false;
    });

    setFormState(updatedState);

    if (!formIsValid) return;

    try {
      const response = await registerUser({
        name: formState.name.value,
        username: formState.username.value,
        email: formState.email.value,
        password: formState.password.value,
        profilePicture: formState.profilePicture.value
      });
      
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const allFieldsFilled = () => {
    const requiredFields = ["name", "username", "email", "password"];
    return requiredFields.every(field => formState[field].value.trim() !== "");
  };

  const isSubmitDisabled = isLoading || !allFieldsFilled();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
          <p className="text-gray-600 text-sm">Únete a la comunidad BLFAGS</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              value={formState.name.value}
              onChange={(e) => handleInputValueChange(e.target.value, 'name')}
              onFocus={() => handleInputFocus('name')}
              onBlur={() => handleInputBlur('name')}
              className={`w-full px-4 py-4 border-2 rounded-lg focus:outline-none transition-all duration-300 placeholder-gray-500 ${
                formState.name.showError 
                  ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
              }`}
              placeholder="Nombre completo"
            />
            {formState.name.showError && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-500 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {getValidationMessage('name')}
              </motion.p>
            )}
          </div>

          {/* Username */}
          <div className="relative">
            <input
              type="text"
              value={formState.username.value}
              onChange={(e) => handleInputValueChange(e.target.value, 'username')}
              onFocus={() => handleInputFocus('username')}
              onBlur={() => handleInputBlur('username')}
              className={`w-full px-4 py-4 border-2 rounded-lg focus:outline-none transition-all duration-300 placeholder-gray-500 ${
                formState.username.showError 
                  ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
              }`}
              placeholder="Nombre de usuario"
            />
            {formState.username.showError && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-500 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {getValidationMessage('username')}
              </motion.p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              value={formState.email.value}
              onChange={(e) => handleInputValueChange(e.target.value, 'email')}
              onFocus={() => handleInputFocus('email')}
              onBlur={() => handleInputBlur('email')}
              className={`w-full px-4 py-4 border-2 rounded-lg focus:outline-none transition-all duration-300 placeholder-gray-500 ${
                formState.email.showError 
                  ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
              }`}
              placeholder="Correo electrónico"
            />
            {formState.email.showError && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-500 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {getValidationMessage('email')}
              </motion.p>
            )}
          </div>

          {/* Password */}
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
            
            {/* Password Requirements Helper */}
            {(formState.password.isFocused || formState.password.value) && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-gray-50 rounded-lg border"
              >
                <p className="text-xs text-gray-600 mb-2 font-medium">Requisitos de la contraseña:</p>
                <div className="space-y-1">
                  <div className={`flex items-center text-xs ${formState.password.value.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className={`w-3 h-3 mr-1 ${formState.password.value.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Al menos 8 caracteres
                  </div>
                  <div className={`flex items-center text-xs ${/[a-z]/.test(formState.password.value) ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className={`w-3 h-3 mr-1 ${/[a-z]/.test(formState.password.value) ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Una letra minúscula
                  </div>
                  <div className={`flex items-center text-xs ${/[A-Z]/.test(formState.password.value) ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className={`w-3 h-3 mr-1 ${/[A-Z]/.test(formState.password.value) ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Una letra mayúscula
                  </div>
                  <div className={`flex items-center text-xs ${/\d/.test(formState.password.value) ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className={`w-3 h-3 mr-1 ${/\d/.test(formState.password.value) ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Un número
                  </div>
                  <div className={`flex items-center text-xs ${/[@$!%*?&#._/-]/.test(formState.password.value) ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className={`w-3 h-3 mr-1 ${/[@$!%*?&#._/-]/.test(formState.password.value) ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Un símbolo especial (@$!%*?&#._/-)
                  </div>
                </div>
              </motion.div>
            )}
            
            {formState.password.showError && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-500 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {getValidationMessage('password')}
              </motion.p>
            )}
          </div>

          {/* Profile Picture */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg text-left text-gray-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center justify-between group"
            >
              <span className="text-gray-600 group-hover:text-blue-600">
                {formState.profilePicture.value ? formState.profilePicture.value.name : "Foto de perfil (opcional)"}
              </span>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            
            {previewImage && (
              <div className="mt-4 flex justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 hover:opacity-10 transition-opacity"></div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Botón Create Account */}
          <motion.button 
            type="submit"
            disabled={isSubmitDisabled}
            whileHover={!isSubmitDisabled ? { scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 mt-6 ${
              isSubmitDisabled 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creando cuenta...</span>
              </div>
            ) : "Crear Cuenta"}
          </motion.button>
        </form>

        {/* Enlace de login */}
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
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={switchAuthHandler}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              Iniciar Sesión
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

Register.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired,
};
