import {useReactions} from '../../shared/hooks/useReactions.jsx';
import {useUser} from '../../contexts/UserContext.jsx';
import toast from 'react-hot-toast';
const types = [{type:'like',icon:'❤️',label:'Me gusta'},{type:'love',icon:'😍',label:'Me encanta'},{type:'laugh',icon:'😂',label:'Me divierte'},{type:'sad',icon:'😢',label:'Me entristece'},{type:'angry',icon:'😡',label:'Me enoja'}];
export function PublicationReactions({publication}) {
 const {isAuthenticated} = useUser(),{counts,userReaction,mutate,isPending} = useReactions(publication);
 return <div className="reactions" aria-label="Reacciones">{types.map(({type,icon,label}) => <button key={type} className={userReaction === type ? 'reaction active':'reaction'} aria-label={label} aria-pressed={userReaction === type} disabled={isPending} onClick={() => {if (!isAuthenticated) return toast('Inicia sesión para reaccionar'); mutate(userReaction === type ? null:type);}}><span aria-hidden="true">{icon}</span><span>{counts?.[type] || 0}</span></button>)}</div>;
}
