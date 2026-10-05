import {useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {updateProfilePicture,getErrorMessage} from '../../services/api.jsx';
import {Input,Button,Card,Avatar} from '../ui/index.jsx';
import {useUser} from '../../contexts/UserContext.jsx';
export default function UserPhotoSettings() {
 const {user,updateUserData} = useUser(),mutation = useMutation({mutationFn:data => updateProfilePicture(user.uid,data),onSuccess:data => {updateUserData(data.user); toast.success('Foto actualizada');},onError:error => toast.error(getErrorMessage(error))});
 return <Card><h2>Tu imagen</h2><Avatar user={user} size="large"/><p>Una ilustración protege mejor tu identidad que una foto personal.</p><form className="stack" onSubmit={event => {event.preventDefault(); mutation.mutate(new FormData(event.currentTarget));}}><Input label="Imagen (máximo 4 MB)" name="profilePicture" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required/><Button type="submit" disabled={mutation.isPending}>Actualizar imagen</Button></form></Card>;
}
