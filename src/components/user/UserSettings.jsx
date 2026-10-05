import {useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {updateUser,getErrorMessage} from '../../services/api.jsx';
import {Input,Button,Card} from '../ui/index.jsx';
import {useUser} from '../../contexts/UserContext.jsx';
export default function UserSettings() {
 const {user,updateUserData} = useUser();
 const mutation = useMutation({mutationFn:data => updateUser(user.uid,data),onSuccess:data => {updateUserData(data.user); toast.success('Alias actualizado');},onError:error => toast.error(getErrorMessage(error))});
 return <Card><h2>Tu alias</h2><p>Elige uno que no revele quién eres.</p><form className="stack" onSubmit={event => {event.preventDefault(); mutation.mutate({username:new FormData(event.currentTarget).get('username')});}}><Input label="Alias público" name="username" defaultValue={user.username} pattern="[a-zA-Z0-9_]{3,20}" maxLength={20} required/><Button type="submit" disabled={mutation.isPending}>Guardar alias</Button></form></Card>;
}
