import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import { useState } from "react";
import toast from "react-hot-toast";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async ({
    name,
    username,
    email,
    password,
    profilePicture = null
  }) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await register(formData);

      if (response.error) {
        const errorMessage = response.e?.response?.data?.error || 
                            response.e?.response?.data?.message ||
                            "Error al registrar la cuenta";
        toast.error(errorMessage);
        return null;
      } else {
        toast.success(response.data.message || "Usuario registrado exitosamente");
        
        navigate("/auth", { replace: true });
        
        return response.data;
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message ||
                          "Error al registrar la cuenta";
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    isLoading
  };
};