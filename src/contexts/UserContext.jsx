import {createContext,useContext,useState,useEffect,useCallback} from 'react';
import {useQueryClient} from '@tanstack/react-query';
const UserContext = createContext(null);
export const normalizeUser = data => {
 if (!data?.token) return null;
 const source = data.user || data;
 return {uid:source.uid || source._id,username:source.username,profilePicture:source.profilePicture || null,role:source.role,token:data.token};
};
const readUser = () => {try {return normalizeUser(JSON.parse(localStorage.getItem('user')));} catch {return null;}};
export const useUser = () => useContext(UserContext);
export function UserProvider({children}) {
 const [user,setUser] = useState(readUser),client = useQueryClient();
 const logout = useCallback(() => {localStorage.removeItem('user'); setUser(null); client.clear();},[client]);
 const login = useCallback(data => {const normalized = normalizeUser(data); client.clear(); setUser(normalized); if (normalized) localStorage.setItem('user',JSON.stringify(normalized));},[client]);
 const updateUserData = data => {const updated = normalizeUser({...user,...data}); setUser(updated); localStorage.setItem('user',JSON.stringify(updated));};
 useEffect(() => {if (user) localStorage.setItem('user',JSON.stringify(user));},[user]);
 useEffect(() => {
  const sync = () => {client.clear(); setUser(readUser());};
  window.addEventListener('session-expired',logout); window.addEventListener('storage',sync);
  return () => {window.removeEventListener('session-expired',logout); window.removeEventListener('storage',sync);};
 },[client,logout]);
 return <UserContext.Provider value={{user,isAuthenticated:Boolean(user?.token),login,logout,updateUserData,getUserInitials:() => user?.username?.[0]?.toUpperCase() || 'U'}}>{children}</UserContext.Provider>;
}
