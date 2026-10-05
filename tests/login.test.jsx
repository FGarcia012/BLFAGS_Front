import {vi,it,expect} from 'vitest';
import {renderHook,act} from '@testing-library/react';
import toast from 'react-hot-toast';
vi.mock('react-hot-toast',()=>({default:{error:vi.fn()}}));
vi.mock('react-router-dom',()=>({useNavigate:()=>vi.fn()}));
vi.mock('../src/contexts/UserContext.jsx',()=>({useUser:()=>({login:vi.fn()})}));
vi.mock('../src/services/api.jsx',()=>({login:vi.fn(),getErrorMessage:()=> 'No se pudo completar la solicitud'}));
import {login} from '../src/services/api.jsx';
import {useLogin} from '../src/shared/hooks/useLogin.jsx';
it('muestra el mismo mensaje para cualquier rechazo de credenciales',async()=>{
 for (const reason of ['Usuario inexistente','Contraseña incorrecta']) {
  vi.mocked(login).mockRejectedValueOnce({response:{status:401,data:{message:reason}}});
  const {result,unmount}=renderHook(useLogin);
  await act(async()=>result.current.loginUser({username:'ficticio',password:'Ficticia!123'}));
  expect(toast.error).toHaveBeenLastCalledWith('Credenciales inválidas');unmount();
 }
});
