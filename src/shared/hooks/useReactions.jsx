import {useMutation,useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {addReaction,deleteReaction,getErrorMessage} from '../../services/api.jsx';
import {patchPublication,publicationId} from './query-cache.js';
export function useReactions(publication) {
 const client = useQueryClient(),pid = publicationId(publication);
 const mutation = useMutation({
  scope:{id:`reaction-${pid}`},
  mutationFn:type => type ? addReaction(pid,{type}):deleteReaction(pid),
  onMutate:async type => {
   await client.cancelQueries({queryKey:['publications']});
   const previous = {reactionCount:publication.reactionCount,userReaction:publication.userReaction};
   patchPublication(client,pid,row => {
    const counts = {...row.reactionCount},old = row.userReaction;
    if (old) {counts[old] = Math.max(0,(counts[old] || 0)-1); counts.total = Math.max(0,(counts.total || 0)-1);}
    if (type) {counts[type] = (counts[type] || 0)+1; counts.total = (counts.total || 0)+1;}
    return {reactionCount:counts,userReaction:type};
   }); return previous;
  },
  onSuccess:data => patchPublication(client,pid,{reactionCount:data.counts,userReaction:data.userReaction}),
  onError:(error,_type,previous) => {patchPublication(client,pid,previous); toast.error(getErrorMessage(error));}
 });
 return {counts:publication.reactionCount,userReaction:publication.userReaction,mutate:mutation.mutate,isPending:mutation.isPending};
}
