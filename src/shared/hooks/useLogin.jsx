import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import toast from "react-hot-toast";
import { useState } from "react";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async ({ email, username, password }) => {
    try {
      setIsLoading(true);

      const loginData = { password };
      if (email) {
        loginData.email = email;
      }
      if (username) {
        loginData.username = username;
      }

      const response = await login(loginData);

      let userDetails, token;
      
      if (response.data?.userDetails?.token) {
        userDetails = response.data.userDetails;
        token = userDetails.token;
        const { token: _, ...userWithoutToken } = userDetails;
        userDetails = userWithoutToken;
      } else {
        userDetails = response.data?.userDetails;
        token = response.data?.token;
      }

      if (!userDetails) {
        toast.error("Detalles del usuario no encontrados en la respuesta.");
        return;
      }

      if (!token) {
        toast.error("Token de autenticación no encontrado en la respuesta.");
        return;
      }

      const userToSave = {
        ...userDetails,
        token: token
      };

      toast.success(response.data.message || "Inicio de sesión exitoso");

      localStorage.setItem("user", JSON.stringify(userToSave));

      navigate("/publications", { replace: true });

    } catch (error) {
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message || 
                          "";

      if (errorMessage.toLowerCase().includes("credenciales invalidas")) {
        if (errorMessage.includes("usuario") || errorMessage.includes("correo")) {
          toast.error("Usuario o correo electrónico incorrecto");
        } else if (errorMessage.includes("contraseña")) {
          toast.error("Contraseña incorrecta");
        } else {
          toast.error("Credenciales inválidas");
        }
      } else {
        toast.error(errorMessage || "Error al iniciar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginUser,
    isLoading,
  };
};