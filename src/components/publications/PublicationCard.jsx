import {useState} from 'react';
import {Link} from 'react-router-dom';
import Lock from 'lucide-react/dist/esm/icons/lock.js';
import Globe from 'lucide-react/dist/esm/icons/globe.js';
import {Avatar,Badge} from '../ui/index.jsx';
import {PublicationReactions} from './PublicationReactions.jsx';
import {PublicationActions} from './PublicationActions.jsx';
import CommentsToggle from '../comments/CommentsToggle.jsx';
import CommentsList from '../comments/CommentsList.jsx';
export function PublicationCard({publication}) {
 const [open,setOpen] = useState(false),pid = publication.pid || publication._id;
 const video = /\/(video)\//.test(publication.media || '');
 return <article className="card publication-card"><header className="row between"><div className="row"><Avatar user={publication.user}/><div><span className="author">@{publication.user?.username || 'Cuenta eliminada'}</span><time dateTime={publication.createdAt}>{new Date(publication.createdAt).toLocaleDateString('es',{day:'numeric',month:'short',year:'numeric'})}</time></div></div><div className="row"><Badge>{publication.visibility === 'private' ? <><Lock size={12}/>Privado</>:<><Globe size={12}/>Público</>}</Badge><PublicationActions publication={publication}/></div></header><h2><Link to={`/publication/${pid}`}>{publication.title}</Link></h2><p className="publication-text">{publication.description}</p>{publication.media && (video ? <video src={publication.media} controls preload="none" width="640" height="400" referrerPolicy="no-referrer"/>:<img className="post-media" src={publication.media} alt={publication.title} width="640" height="400" loading="lazy" decoding="async" referrerPolicy="no-referrer"/>)}<div className="hashtags">{publication.hashtags?.map(tag => <Link key={tag._id} to={`/hashtags?tag=${encodeURIComponent(tag.name)}`}>#{tag.name}</Link>)}</div><footer className="publication-footer"><PublicationReactions publication={publication}/><CommentsToggle count={publication.commentCount} open={open} onToggle={setOpen}/></footer>{open && <CommentsList publicationId={pid}/>}</article>;
}
export default PublicationCard;
