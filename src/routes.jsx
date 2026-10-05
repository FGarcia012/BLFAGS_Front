import {lazy} from 'react';
import {Navigate,useLocation} from 'react-router-dom';
import {useUser} from './contexts/UserContext.jsx';
import {HomePage as Home} from './pages/home/HomePage.jsx';
const Auth = lazy(() => import('./pages/auth/AuthPage.jsx').then(m => ({default:m.AuthPage})));
const Register = lazy(() => import('./pages/register/RegisterPage.jsx').then(m => ({default:m.RegisterPage})));
const Feed = lazy(() => import('./pages/publications/PublicationsPage.jsx').then(m => ({default:m.PublicationsPage})));
const Detail = lazy(() => import('./pages/publications/PublicationDetailPage.jsx'));
const Profile = lazy(() => import('./pages/user/UserProfilePage.jsx').then(m => ({default:m.UserProfilePage})));
const Settings = lazy(() => import('./pages/user/UserSettingsPageNew.jsx').then(m => ({default:m.UserSettingsPageNew})));
const Tags = lazy(() => import('./pages/hashtags/HashtagsPage.jsx').then(m => ({default:m.HashtagsPage})));
const Admin = lazy(() => import('./components/user/UserManagement.jsx'));
const NotFound = lazy(() => import('./pages/NotFoundPage.jsx'));
export function RequireAuth({children}) {const {isAuthenticated} = useUser(),location = useLocation(); return isAuthenticated ? children:<Navigate to="/auth" replace state={{from:location.pathname}}/>;}
export function RequireAdmin({children}) {const {user} = useUser(); return <RequireAuth>{user?.role === 'ADMIN' ? children:<Navigate to="/publications" replace/>}</RequireAuth>;}
export const routes = [
 {path:'/',element:<Home/>},{path:'/auth',element:<Auth/>},{path:'/register',element:<Register/>},
 {path:'/publications',element:<Feed/>},{path:'/publication/:pid',element:<Detail/>},
 {path:'/profile/:userId',element:<RequireAuth><Profile/></RequireAuth>},
 {path:'/settings',element:<RequireAuth><Settings/></RequireAuth>},
 {path:'/user/:userId/settings',element:<RequireAuth><Settings/></RequireAuth>},
 {path:'/admin/settings/:userId',element:<RequireAdmin><Settings/></RequireAdmin>},
 {path:'/admin',element:<RequireAdmin><Admin/></RequireAdmin>},
 {path:'/hashtags',element:<Tags/>},{path:'*',element:<NotFound/>}
];
