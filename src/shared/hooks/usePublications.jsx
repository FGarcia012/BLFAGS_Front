import { useState, useEffect } from "react";
import { getPublications } from "../../services/api";
import toast from "react-hot-toast";

export const usePublications = () => {
  const [publications, setPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getPublications();

      if (response.error) {
        // Si el error es de autenticación, continuamos sin mostrar error
        // ya que las publicaciones públicas deberían ser visibles sin auth
        if (response.e?.response?.status === 401) {
          setPublications([]);
          return;
        }
        throw new Error(response.e?.response?.data?.message || "Error al obtener las publicaciones");
      }

      if (response.success && response.publications) {
        setPublications(response.publications);
      } else {
        setPublications([]);
      }

    } catch (error) {
      // Solo mostrar error si no es un problema de autenticación
      if (error?.response?.status !== 401) {
        const errorMessage = error?.response?.data?.message || 
                            error?.message || 
                            "Error al cargar las publicaciones";
        
        setError(errorMessage);
        toast.error(errorMessage);
      }
      setPublications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPublications = () => {
    fetchPublications();
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  return {
    publications,
    isLoading,
    error,
    refreshPublications,
    fetchPublications
  };
};
