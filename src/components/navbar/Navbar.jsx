import {useState,useEffect} from 'react';
import {NavLink,Link} from 'react-router-dom';
import Menu from 'lucide-react/dist/esm/icons/menu.js';
import Sun from 'lucide-react/dist/esm/icons/sun.js';
import Moon from 'lucide-react/dist/esm/icons/moon.js';
import VenetianMask from 'lucide-react/dist/esm/icons/venetian-mask.js';
import LogOut from 'lucide-react/dist/esm/icons/log-out.js';
import X from 'lucide-react/dist/esm/icons/x.js';
import {useUser} from '../../contexts/UserContext.jsx';
import {Button,IconButton,Avatar} from '../ui/index.jsx';
export function Navbar() {
 const {user,logout} = useUser(),[open,setOpen] = useState(false),[theme,setTheme] = useState(() => localStorage.getItem('theme') || 'system');
 useEffect(() => {document.documentElement.dataset.theme = theme; if (theme !== 'system') localStorage.setItem('theme',theme);},[theme]);
 const toggle = () => setTheme(current => (current === 'light' || (current === 'system' && !matchMedia('(prefers-color-scheme: dark)').matches)) ? 'dark':'light');
 return <header className="navbar"><a className="skip-link" href="#main">Saltar al contenido</a><div className="nav-inner"><Link to="/" className="brand"><VenetianMask size={28}/>BLFAGS<span className="brand-dot">●</span></Link><nav aria-label="Navegación principal" className={open ? 'nav-links is-open':'nav-links'} onClick={() => setOpen(false)}><NavLink to="/publications">Explorar</NavLink><NavLink to="/hashtags">Hashtags</NavLink>{user && <NavLink to={`/profile/${user.uid}`}>Mi espacio</NavLink>}{user?.role === 'ADMIN' && <NavLink to="/admin">Administración</NavLink>}</nav><div className="row"><IconButton label="Cambiar tema" onClick={toggle}>{theme === 'light' ? <Moon size={20}/>:<Sun size={20}/>}</IconButton>{user ? <><Link to="/settings" className="user-link"><Avatar user={user}/><span>@{user.username}</span></Link><IconButton label="Cerrar sesión" onClick={logout}><LogOut size={18}/></IconButton></>:<Link className="btn btn-primary nav-login" to="/auth">Entrar</Link>}<Button variant="ghost" className="mobile-menu" aria-label={open ? 'Cerrar menú':'Abrir menú'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/>:<Menu/>}</Button></div></div></header>;
}
