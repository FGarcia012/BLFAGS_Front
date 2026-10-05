import {useState} from 'react';
import {useMutation,useQueryClient} from '@tanstack/react-query';
import Pencil from 'lucide-react/dist/esm/icons/pencil.js';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2.js';
import toast from 'react-hot-toast';
import {useUser} from '../../contexts/UserContext.jsx';
import {deletePublication,getErrorMessage} from '../../services/api.jsx';
import {invalidatePublications} from '../../shared/hooks/query-cache.js';
import {IconButton,Modal,Button} from '../ui/index.jsx';
import {EditPublication} from './EditPublication.jsx';
export function PublicationActions({publication}) {
 const {user} = useUser(),[edit,setEdit] = useState(false),[confirm,setConfirm] = useState(false),client = useQueryClient();
 const mutation = useMutation({mutationFn:() => deletePublication(publication.pid || publication._id),onSuccess:async () => {setConfirm(false); await invalidatePublications(client); toast.success('Publicación eliminada');},onError:error => toast.error(getErrorMessage(error))});
 if (!publication.isMine && user?.role !== 'ADMIN') return null;
 return <><IconButton label="Editar publicación" onClick={() => setEdit(true)}><Pencil size={16}/></IconButton><IconButton label="Borrar publicación" onClick={() => setConfirm(true)}><Trash2 size={16}/></IconButton>{edit && <EditPublication publication={publication} onClose={() => setEdit(false)}/>} {confirm && <Modal title="¿Borrar esta publicación?" onClose={() => setConfirm(false)}><p>También se ocultarán sus comentarios y reacciones.</p><Button variant="danger" disabled={mutation.isPending} onClick={() => mutation.mutate()}>Borrar publicación</Button></Modal>}</>;
}
