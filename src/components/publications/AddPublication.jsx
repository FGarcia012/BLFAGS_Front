import {useState} from 'react';
import {useMutation,useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Plus from 'lucide-react/dist/esm/icons/plus.js';
import {addPublications,updatePublication,getErrorMessage} from '../../services/api.jsx';
import {invalidatePublications} from '../../shared/hooks/query-cache.js';
import {Modal,Input,Textarea,Select,Button} from '../ui/index.jsx';
export function PublicationForm({publication,onClose}) {
 const client = useQueryClient(),mutation = useMutation({mutationFn:data => publication ? updatePublication(publication.pid || publication._id,data):addPublications(data),onSuccess:async () => {await invalidatePublications(client); toast.success(publication ? 'Publicación actualizada':'Publicación creada'); onClose();},onError:error => toast.error(getErrorMessage(error))});
 const submit = event => {event.preventDefault(); const data = new FormData(event.currentTarget); if (!data.get('media')?.size) data.delete('media'); mutation.mutate(data);};
 return <Modal title={publication ? 'Editar publicación':'Algo que compartir'} onClose={onClose}><form className="stack" onSubmit={submit}><Input label="Título" name="title" defaultValue={publication?.title || ''} required maxLength={200}/><Textarea label="Tu historia" name="description" defaultValue={publication?.description || ''} required maxLength={1000} rows={5}/><small>Añade #hashtags para encontrar otras voces.</small><Select label="Quién puede verla" name="visibility" defaultValue={publication?.visibility || 'public'}><option value="public">Público · toda la comunidad</option><option value="private">Privado · solo tú</option></Select><Input label="Imagen o video opcional (máximo 4 MB)" name="media" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"/><Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Guardando…':'Guardar publicación'}</Button></form></Modal>;
}
export function AddPublication() {const [open,setOpen] = useState(false); return <><Button onClick={() => setOpen(true)}><Plus size={18}/>Publicar</Button>{open && <PublicationForm onClose={() => setOpen(false)}/>}</>;}
