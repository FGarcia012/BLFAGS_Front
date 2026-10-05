import {useState} from 'react';
import {useSearchParams,Link} from 'react-router-dom';
import {useQuery,useInfiniteQuery} from '@tanstack/react-query';
import {fetchHashtags,fetchPublicationsByHashtag} from '../../services/api.jsx';
import {useUser} from '../../contexts/UserContext.jsx';
import {PublicationCard} from '../../components/publications/PublicationCard.jsx';
import {Input,Button,EmptyState,ErrorState,Skeleton} from '../../components/ui/index.jsx';
export function HashtagsPage() {
 const [params] = useSearchParams(),tag = params.get('tag'),[search,setSearch] = useState(''),{user} = useUser();
 const tags = useQuery({queryKey:['hashtags',user?.uid],queryFn:({signal}) => fetchHashtags(signal),enabled:!tag});
 const posts = useInfiniteQuery({queryKey:['hashtagPublications',tag,user?.uid],initialPageParam:null,enabled:Boolean(tag),queryFn:({pageParam,signal}) => fetchPublicationsByHashtag(tag,{cursor:pageParam,signal}),getNextPageParam:page => page.hasMore ? page.nextCursor:undefined});
 const query = tag ? posts:tags;
 return <div className="page detail-page"><header className="page-heading"><div><span className="eyebrow">SIGUE EL HILO</span><h1>{tag ? '#'+tag:'Historias que conectan.'}</h1><p>Encuentra voces alrededor de una misma idea.</p></div></header>{!tag && <Input label="Filtrar hashtags" value={search} onChange={event => setSearch(event.target.value)}/>}<div className="stack">{query.isPending ? <Skeleton/>:query.isError ? <ErrorState retry={query.refetch}/>:tag ? posts.data.pages.flatMap(page => page.publications).length ? posts.data.pages.flatMap(page => page.publications).map(publication => <PublicationCard key={publication.pid} publication={publication}/>):<EmptyState/>:<div className="tag-grid">{tags.data.hashtags.filter(item => item.name.includes(search.toLowerCase())).map(item => <Link className="card tag-card" key={item.hid} to={`/hashtags?tag=${encodeURIComponent(item.name)}`}><strong>#{item.name}</strong><span>{item.publications.length} historias visibles</span></Link>)}</div>}{tag && posts.hasNextPage && <Button disabled={posts.isFetchingNextPage} onClick={() => posts.fetchNextPage()}>Cargar más</Button>}</div></div>;
}
