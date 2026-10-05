import {useQuery} from '@tanstack/react-query';
import {getUsers} from '../../services/api.jsx';
import {Card,Skeleton,ErrorState,Badge} from '../ui/index.jsx';
export default function UserManagement() {
 const query = useQuery({queryKey:['adminUsers'],queryFn:({signal}) => getUsers(signal)});
 return <div className="page"><header className="page-heading"><div><span className="eyebrow">ADMINISTRACIÓN</span><h1>Cuida de la comunidad.</h1><p>Los datos personales no forman parte de este panel.</p></div></header>{query.isPending ? <Skeleton/>:query.isError ? <ErrorState retry={query.refetch}/>:<Card className="table-wrap"><table><caption>Usuarios · hasta 100 cuentas</caption><thead><tr><th>Alias</th><th>Rol</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>{query.data.users.map(user => <tr key={user.uid}><td>@{user.username}</td><td><Badge>{user.role}</Badge></td><td>{user.status ? 'Activo':'Desactivado'}</td><td>{new Date(user.createdAt).toLocaleDateString('es')}</td></tr>)}</tbody></table></Card>}</div>;
}
