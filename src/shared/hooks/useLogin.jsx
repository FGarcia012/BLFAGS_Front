import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import {login,getErrorMessage} from '../../services/api.jsx';
import {useUser} from '../../contexts/UserContext.jsx';
export const useLogin = () => {
 const [isLoading,setIsLoading] = useState(false),{login:saveUser} = useUser(),navigate = useNavigate();
 const loginUser = async data => {
  setIsLoading(true);
  try {const response = await login(data); saveUser({...response.data.userDetails,token:response.data.token}); navigate('/publications',{replace:true});}
  catch(error) {toast.error(error.response?.status === 401 ? 'Credenciales inválidas':getErrorMessage(error));}
  finally {setIsLoading(false);}
 };
 return {loginUser,isLoading};
};
