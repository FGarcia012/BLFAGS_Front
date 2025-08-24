import { HomePage } from "./pages/home/HomePage";
import { AuthPage } from "./pages/auth/AuthPage";
import { RegisterPage } from "./pages/register/RegisterPage";
import { PublicationsPage } from "./pages/publications/PublicationsPage";
import { UserProfilePage } from "./pages/user/UserProfilePage";
import UserSettingsPageNew from "./pages/user/UserSettingsPageNew";
import CommentsExamplePage from "./pages/comments/CommentsExamplePage";
import HashtagsPage from "./pages/hashtags/HashtagsPage";

export const routes = [
    {path: '/*', element: <HomePage/>},
    {path: '/auth', element: <AuthPage/>},
    {path: '/register', element: <RegisterPage/>},
    {path: '/publications', element: <PublicationsPage/>},
    {path: '/profile/:userId', element: <UserProfilePage/>},
    {path: '/user/:userId/settings', element: <UserSettingsPageNew/>},
    {path: '/settings', element: <UserSettingsPageNew/>},
    {path: '/admin/settings/:userId', element: <UserSettingsPageNew/>},
    {path: '/comments-example', element: <CommentsExamplePage/>},
    {path: '/hashtags', element: <HashtagsPage/>}
]