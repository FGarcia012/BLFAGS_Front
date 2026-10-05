import {useState} from 'react';
import {Link} from 'react-router-dom';
import Eye from 'lucide-react/dist/esm/icons/eye.js';
import EyeOff from 'lucide-react/dist/esm/icons/eye-off.js';
import {useLogin} from '../shared/hooks/useLogin.jsx';
import {Input,Button,IconButton} from './ui/index.jsx';
export function Login() {
 const [show,setShow] = useState(false),{loginUser,isLoading} = useLogin();
 const submit = event => {event.preventDefault(); const data = new FormData(event.currentTarget),identity = data.get('identity').trim(); loginUser({...identity.includes('@') ? {email:identity}:{username:identity},password:data.get('password')});};
 return <div className="auth-card card"><span className="eyebrow">QUÉ BUENO VERTE</span><h1>Vuelve a tu espacio.</h1><p>Tu alias, tus ideas, tu comunidad.</p><form onSubmit={submit} className="stack"><Input label="Alias o correo" name="identity" autoComplete="username" required maxLength={254}/><div className="password-field"><Input label="Contraseña" name="password" type={show ? 'text':'password'} autoComplete="current-password" required maxLength={128}/><IconButton label={show ? 'Ocultar contraseña':'Mostrar contraseña'} onClick={() => setShow(!show)}>{show ? <EyeOff size={18}/>:<Eye size={18}/>}</IconButton></div><Button type="submit" disabled={isLoading}>{isLoading ? 'Entrando…':'Iniciar sesión'}</Button></form><p>¿Todavía no tienes un alias? <Link to="/register">Crea tu cuenta</Link></p></div>;
}
