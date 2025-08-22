import { useState, useEffect } from "react";
import { getPublications } from "../../services/api";
import { usePublicationsRefresh } from "../../contexts/PublicationsRefreshContext";
import toast from "react-hot-toast";

export const usePublications = (initialSearchTerm = '') => {
  const [publications, setPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const { subscribe } = usePublicationsRefresh();

  const fetchPublications = async (search = searchTerm) => {
    try {
      setIsLoading(true);
      setError(null);

      const userDetails = localStorage.getItem("user");
      const user = userDetails ? JSON.parse(userDetails) : null;

      const response = await getPublications(search);

      if (response.error) {
        if (response.e?.response?.status === 401) {
          setPublications([]);
          return;
        }
        
        if (response.e?.response?.status === 404) {
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
      if (error?.response?.status !== 401 && error?.response?.status !== 404) {
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
    fetchPublications(searchTerm);
  };

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    fetchPublications(newSearchTerm);
  };

  useEffect(() => {
    fetchPublications();
    
    const unsubscribe = subscribe(() => fetchPublications(searchTerm));
    
    return unsubscribe;
  }, [subscribe]);

  return {
    publications,
    isLoading,
    error,
    searchTerm,
    refreshPublications,
    fetchPublications,
    handleSearch
  };
};
