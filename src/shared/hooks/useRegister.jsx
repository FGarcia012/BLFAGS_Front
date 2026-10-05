import {useMutation} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import {register,getErrorMessage} from '../../services/api.jsx';
export function useRegister() {
 const navigate = useNavigate();
 const mutation = useMutation({mutationFn:register,onSuccess:() => {toast.success('Cuenta creada. Ya puedes iniciar sesión'); navigate('/auth');},onError:error => toast.error(getErrorMessage(error))});
 return {registerUser:mutation.mutate,isLoading:mutation.isPending};
}
