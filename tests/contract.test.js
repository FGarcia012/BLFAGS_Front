import {it,expect} from 'vitest';
import {normalizeUser} from '../src/contexts/UserContext.jsx';
it('solo conserva los campos permitidos de la sesión',()=>{
 expect(normalizeUser({uid:'a',username:'alias',role:'USER',profilePicture:null,token:'token-ficticio',email:'test@example.invalid',name:'Ficticio',password:'nunca'})).toEqual({uid:'a',username:'alias',role:'USER',profilePicture:null,token:'token-ficticio'});
});
