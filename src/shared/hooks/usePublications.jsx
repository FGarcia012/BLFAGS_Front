import {useState,useEffect} from 'react';
import {useInfiniteQuery,useQueryClient} from '@tanstack/react-query';
import {getPublications} from '../../services/api.jsx';
import {useUser} from '../../contexts/UserContext.jsx';
export function usePublications(search = '',filter = 'all') {
 const {user} = useUser(),[debounced,setDebounced] = useState(search),client = useQueryClient();
 useEffect(() => {const timer = setTimeout(() => setDebounced(search),400); return () => clearTimeout(timer);},[search]);
 const key = ['publications',{search:debounced,filter,uid:user?.uid || null}];
 const query = useInfiniteQuery({queryKey:key,initialPageParam:null,queryFn:async ({pageParam,signal}) => ({...await getPublications(debounced.trim().length >= 2 ? debounced:'',{cursor:pageParam,filter,signal}),receivedAt:Date.now()}),getNextPageParam:page => page.hasMore ? page.nextCursor:undefined,refetchInterval:60000,refetchIntervalInBackground:false,
  structuralSharing:(old,incoming) => {
   if (!old || old.acceptIncoming || old.pages[0]?.receivedAt === incoming.pages[0]?.receivedAt || incoming.pages.length !== old.pages.length) return incoming;
   const oldIds = new Set(old.pages.flatMap(page => page.publications.map(row => row.pid)));
   const fresh = new Map(incoming.pages.flatMap(page => page.publications.map(row => [row.pid,row])));
   const pending = incoming.pages.some(page => page.publications.some(row => !oldIds.has(row.pid)));
   if (!pending) return incoming;
   return {...incoming,pending:true,pages:incoming.pages.map((page,i) => ({...page,latest:page,publications:old.pages[i].publications.map(row => fresh.get(row.pid) || row)}))};
  }});
 const refresh = () => {client.setQueryData(key,old => old ? {...old,acceptIncoming:true}:old); return query.refetch();};
 const showNew = () => client.setQueryData(key,old => ({...old,pending:false,pages:old.pages.map(page => page.latest || page)}));
 return {...query,refresh,showNew,hasNew:query.data?.pending,publications:query.data?.pages.flatMap(page => page.publications) || []};
}
