import {useInfiniteQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {getCommentsByPublication,addComments,deleteComment,getErrorMessage} from '../../services/api.jsx';
import {patchPublication} from './query-cache.js';
import {useUser} from '../../contexts/UserContext.jsx';
export function useComments(pid,open = true) {
 const client = useQueryClient(),{user} = useUser(),key = ['comments',pid,user?.uid || null];
 const query = useInfiniteQuery({queryKey:key,initialPageParam:null,enabled:open,queryFn:({pageParam,signal}) => getCommentsByPublication(pid,{cursor:pageParam,signal}),getNextPageParam:page => page.hasMore ? page.nextCursor:undefined});
 const add = useMutation({mutationFn:addComments,onSuccess:data => {
  client.setQueryData(key,old => old ? {...old,pages:old.pages.map((page,i) => i === 0 ? {...page,comments:[data.comment,...page.comments]}:page)}:{pages:[{comments:[data.comment],hasMore:false,nextCursor:null}],pageParams:[null]});
  patchPublication(client,pid,{commentCount:data.commentCount});
 },onError:error => toast.error(getErrorMessage(error))});
 const remove = useMutation({mutationFn:deleteComment,onSuccess:data => {
  client.setQueryData(key,old => old ? {...old,pages:old.pages.map(page => ({...page,comments:page.comments.filter(c => (c.cid || c._id) !== data.cid)}))}:old);
  patchPublication(client,pid,{commentCount:data.commentCount});
 },onError:error => toast.error(getErrorMessage(error))});
 return {...query,comments:query.data?.pages.flatMap(page => page.comments) || [],add,remove};
}
