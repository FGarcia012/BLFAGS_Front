import MessageCircle from 'lucide-react/dist/esm/icons/message-circle.js';
export default function CommentsToggle({count = 0,open,onToggle}) {return <button className="comments-toggle" aria-expanded={open} onClick={() => onToggle(!open)}><MessageCircle size={18}/>{count} <span>comentarios</span></button>;}
