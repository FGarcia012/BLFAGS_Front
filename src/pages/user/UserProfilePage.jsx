import {useParams} from 'react-router-dom';
import {useQuery,useInfiniteQuery} from '@tanstack/react-query';
import {getUserById,getPublicationsByUser} from '../../services/api.jsx';
import {useUser} from '../../contexts/UserContext.jsx';
import {Avatar,Skeleton,ErrorState,EmptyState,Button} from '../../components/ui/index.jsx';
import {PublicationCard} from '../../components/publications/PublicationCard.jsx';
import {AddPublication} from '../../components/publications/AddPublication.jsx';
export function UserProfilePage() {
 const {userId} = useParams(),{user} = useUser();
 const profile = useQuery({queryKey:['user',userId,user?.uid],queryFn:({signal}) => getUserById(userId,signal)});
 const posts = useInfiniteQuery({queryKey:['userPublications',userId,user?.uid],initialPageParam:null,queryFn:({pageParam,signal}) => getPublicationsByUser(userId,{cursor:pageParam,signal}),getNextPageParam:page => page.hasMore ? page.nextCursor:undefined});
 if (profile.isPending) return <div className="page"><Skeleton/></div>;
 if (profile.isError) return <div className="page"><ErrorState>Perfil no disponible</ErrorState></div>;
 return <div className="page detail-page"><header className="profile-heading"><Avatar user={profile.data.user} size="large"/><span className="eyebrow">UN ALIAS, MUCHAS HISTORIAS</span><h1>@{profile.data.user.username}</h1><p>Miembro desde {new Date(profile.data.user.createdAt).toLocaleDateString('es',{month:'long',year:'numeric'})}</p>{userId === user?.uid && <AddPublication/>}</header><div className="stack">{posts.isPending ? <Skeleton/>:posts.isError ? <ErrorState retry={posts.refetch}/>:posts.data.pages.flatMap(page => page.publications).length ? posts.data.pages.flatMap(page => page.publications).map(publication => <PublicationCard key={publication.pid} publication={publication}/>):<EmptyState>Este espacio espera su primera historia.</EmptyState>}{posts.hasNextPage && <Button disabled={posts.isFetchingNextPage} onClick={() => posts.fetchNextPage()}>Más publicaciones</Button>}</div></div>;
}
