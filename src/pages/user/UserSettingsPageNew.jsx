import {useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {getUserById} from '../../services/api.jsx';
import {useUser} from '../../contexts/UserContext.jsx';
import UserSettings from '../../components/user/UserSettings.jsx';
import UserPhotoSettings from '../../components/user/UserPhotoSettings.jsx';
import UserPasswordSettings from '../../components/user/UserPasswordSettings.jsx';
import UserAccountSettings from '../../components/user/UserAccountSettings.jsx';
import {Card,Skeleton,ErrorState} from '../../components/ui/index.jsx';
export function UserSettingsPageNew() {
 const {user} = useUser(),{userId} = useParams(),uid = userId || user.uid;
 const query = useQuery({queryKey:['user',uid,user.uid],queryFn:({signal}) => getUserById(uid,signal)});
 if (uid !== user.uid) return <div className="page"><Card><h1>Perfil público</h1><p>El administrador no puede modificar la identidad ni las credenciales de otra cuenta.</p></Card></div>;
 return <div className="page settings-page"><header className="page-heading"><div><span className="eyebrow">TÚ TIENES EL CONTROL</span><h1>Tu espacio, a tu manera.</h1></div></header><div className="settings-grid"><div className="stack"><UserSettings/><UserPhotoSettings/></div><div className="stack"><Card><h2>Correo privado</h2>{query.isPending ? <Skeleton/>:query.isError ? <ErrorState retry={query.refetch}/>:<><p>{query.data.user.email}</p><small>Solo tú puedes verlo aquí. No se guarda en el navegador.</small></>}</Card><UserPasswordSettings/><UserAccountSettings/></div></div></div>;
}
