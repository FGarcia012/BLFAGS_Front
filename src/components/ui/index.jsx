import {useEffect,useRef,useId} from 'react';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle.js';
import LoaderCircle from 'lucide-react/dist/esm/icons/loader-circle.js';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle.js';
import X from 'lucide-react/dist/esm/icons/x.js';
export function Button({children,variant = 'primary',className = '',type = 'button',...props}) {return <button type={type} className={`btn btn-${variant} ${className}`} {...props}>{children}</button>;}
export function IconButton({label,children,...props}) {return <Button variant="ghost" aria-label={label} {...props}>{children}</Button>;}
export function Input({label,id,...props}) {const generated = useId(); return <label className="field" htmlFor={id || generated}>{label}<input id={id || generated} {...props}/></label>;}
export function Textarea({label,...props}) {return <label className="field">{label}<textarea {...props}/></label>;}
export function Select({label,children,...props}) {return <label className="field">{label}<select {...props}>{children}</select></label>;}
export function Card({children,className = '',...props}) {return <section className={`card ${className}`} {...props}>{children}</section>;}
export function Avatar({user,size = 'normal'}) {return user?.profilePicture ? <img className={`avatar avatar-${size}`} src={user.profilePicture} alt="" width="44" height="44" loading="lazy" decoding="async" referrerPolicy="no-referrer"/>:<span className={`avatar avatar-${size}`} aria-hidden="true">{user?.username?.[0]?.toUpperCase() || '?'}</span>;}
export function Badge({children}) {return <span className="badge">{children}</span>;}
export function Spinner() {return <span className="spinner" role="status" aria-label="Cargando"><LoaderCircle size={20}/></span>;}
export function Skeleton() {return <div className="card skeleton" aria-label="Cargando publicación"><div/><div/><div/></div>;}
export function EmptyState({children = 'Todavía no hay publicaciones'}) {return <Card className="empty"><MessageCircle size={32}/><p>{children}</p></Card>;}
export function ErrorState({children,retry}) {return <Card className="error" role="alert"><AlertCircle/><p>{children || 'No se pudo cargar el contenido'}</p>{retry && <Button onClick={retry}>Reintentar</Button>}</Card>;}
export function Modal({title,children,onClose}) {
 const dialog = useRef(),titleId = useId();
 useEffect(() => {const previous = document.activeElement; dialog.current.showModal(); return () => previous?.focus();},[]);
 return <dialog ref={dialog} className="modal" aria-labelledby={titleId} onCancel={onClose} onClick={event => {if (event.target === event.currentTarget) onClose();}}><div className="row between"><h2 id={titleId}>{title}</h2><IconButton label="Cerrar" onClick={onClose}><X/></IconButton></div>{children}</dialog>;
}
export function Dropdown({label,children}) {return <details className="dropdown"><summary>{label}</summary><div className="card">{children}</div></details>;}
export function Tooltip({label,children}) {return <span title={label}>{children}</span>;}
