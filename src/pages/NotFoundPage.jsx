import {Link} from 'react-router-dom';
export default function NotFoundPage() {return <div className="empty page"><span className="eyebrow">404</span><h1>Este rincón no existe.</h1><p>Tal vez el enlace cambió o la publicación ya no está disponible.</p><Link className="btn btn-primary" to="/publications">Volver a explorar</Link></div>;}
