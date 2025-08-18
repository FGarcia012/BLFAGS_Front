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

      const userDetails = response.data?.userDetails;

      if (!userDetails) {
        toast.error("Detalles del usuario no encontrados en la respuesta.");
        return;
      }

      toast.success(response.data.message || "Inicio de sesión exitoso");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userDetails,
        })
      );

      navigate("/home", { replace: true });

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