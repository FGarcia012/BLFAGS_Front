import {useParams,Link} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {getPublicationById} from '../../services/api.jsx';
import {useUser} from '../../contexts/UserContext.jsx';
import {PublicationCard} from '../../components/publications/PublicationCard.jsx';
import {Skeleton,ErrorState} from '../../components/ui/index.jsx';
export default function PublicationDetailPage() {const {pid} = useParams(),{user} = useUser(),query = useQuery({queryKey:['publication',pid,user?.uid],queryFn:({signal}) => getPublicationById(pid,signal)}); return <div className="page detail-page"><Link className="back-link" to="/publications">← Volver a explorar</Link>{query.isPending ? <Skeleton/>:query.isError ? <ErrorState>Publicación no disponible</ErrorState>:<PublicationCard publication={query.data.publication}/>}</div>;}
