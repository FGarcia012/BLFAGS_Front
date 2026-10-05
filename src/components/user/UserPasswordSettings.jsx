import {useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {updatePassword,getErrorMessage} from '../../services/api.jsx';
import {Input,Button,Card} from '../ui/index.jsx';
import {useUser} from '../../contexts/UserContext.jsx';
export default function UserPasswordSettings() {
 const {user} = useUser(),mutation = useMutation({mutationFn:data => updatePassword(user.uid,data),onSuccess:() => toast.success('Contraseña actualizada'),onError:error => toast.error(getErrorMessage(error))});
 return <Card><h2>Contraseña</h2><form className="stack" onSubmit={event => {event.preventDefault(); const data = new FormData(event.currentTarget); mutation.mutate(Object.fromEntries(data));}}><Input label="Contraseña actual" name="currentPassword" type="password" autoComplete="current-password" required maxLength={128}/><Input label="Nueva contraseña" name="newPassword" type="password" autoComplete="new-password" required minLength={8} maxLength={128}/><small>Usa mayúscula, minúscula, número y símbolo.</small><Button type="submit" disabled={mutation.isPending}>Actualizar contraseña</Button></form></Card>;
}
