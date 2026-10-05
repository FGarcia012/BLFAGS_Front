import {vi,it,expect} from 'vitest';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
vi.mock('../src/contexts/UserContext.jsx',()=>({useUser:()=>({isAuthenticated:true,user:{uid:'a'}})}));
vi.mock('../src/services/api.jsx',()=>({addReaction:vi.fn(),deleteReaction:vi.fn(),getErrorMessage:()=> 'No se pudo completar la solicitud'}));
import {PublicationReactions} from '../src/components/publications/PublicationReactions.jsx';
import {addReaction} from '../src/services/api.jsx';
const initial = {pid:'p',reactionCount:{like:0,love:0,laugh:0,sad:0,angry:0,total:0},userReaction:null};
function Harness() {const {data}=useQuery({queryKey:['publications'],queryFn:()=>null,enabled:false});return <PublicationReactions publication={data.pages[0].publications[0]}/>;}
const setup=()=>{const client=new QueryClient({defaultOptions:{queries:{retry:false}}});client.setQueryData(['publications'],{pages:[{publications:[initial]}],pageParams:[null]});render(<QueryClientProvider client={client}><Harness/></QueryClientProvider>);return client;};
it('una reacción usa una petición y se actualiza antes de responder',async()=>{
 let resolve; vi.mocked(addReaction).mockImplementation(()=>new Promise(done=>{resolve=done;}));
 const client=setup();fireEvent.click(screen.getByRole('button',{name:'Me gusta'}));
 await waitFor(()=>expect(client.getQueryData(['publications']).pages[0].publications[0].reactionCount.like).toBe(1));
 expect(addReaction).toHaveBeenCalledTimes(1);expect(screen.getByRole('button',{name:'Me gusta'})).toBeDisabled();
 resolve({counts:{...initial.reactionCount,like:1,total:1},userReaction:'like'});
 await waitFor(()=>expect(screen.getByRole('button',{name:'Me gusta'})).not.toBeDisabled());
});
it('revierte la actualización si falla la petición',async()=>{
 vi.mocked(addReaction).mockRejectedValueOnce(new Error('Error ficticio'));
 const client=setup();fireEvent.click(screen.getByRole('button',{name:'Me gusta'}));
 await waitFor(()=>expect(client.getQueryData(['publications']).pages[0].publications[0].userReaction).toBeNull());
 await waitFor(()=>expect(screen.getByRole('button',{name:'Me gusta'})).not.toBeDisabled());
 expect(client.getQueryData(['publications']).pages[0].publications[0].reactionCount.like).toBe(0);
});
