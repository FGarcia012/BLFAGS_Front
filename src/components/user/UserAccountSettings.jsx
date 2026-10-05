import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {deleteUser,getErrorMessage} from '../../services/api.jsx';
import {Button,Card,Modal} from '../ui/index.jsx';
import {useUser} from '../../contexts/UserContext.jsx';
export default function UserAccountSettings() {
 const {user,logout} = useUser(),[confirm,setConfirm] = useState(false),mutation = useMutation({mutationFn:() => deleteUser(user.uid),onSuccess:() => {logout(); toast.success('Cuenta eliminada');},onError:error => toast.error(getErrorMessage(error))});
 return <Card><h2>Eliminar cuenta</h2><p>Anonimizaremos tu cuenta y ocultaremos tus publicaciones y comentarios.</p><Button variant="danger" onClick={() => setConfirm(true)}>Eliminar mi cuenta</Button>{confirm && <Modal title="¿Eliminar tu cuenta?" onClose={() => setConfirm(false)}><p>Esta acción no se puede deshacer.</p><Button variant="danger" disabled={mutation.isPending} onClick={() => mutation.mutate()}>Sí, eliminar mi cuenta</Button></Modal>}</Card>;
}
