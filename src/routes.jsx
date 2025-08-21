import { HomePage } from "./pages/home/HomePage";
import { AuthPage } from "./pages/auth/AuthPage";
import { RegisterPage } from "./pages/register/RegisterPage";
import { PublicationsPage } from "./pages/publications/PublicationsPage";
import { UserProfilePage } from "./pages/user/UserProfilePage";
import { UserSettingsPage } from "./pages/user/UserSettingsPage";

export const routes = [
    {path: '/*', element: <HomePage/>},
    {path: '/auth', element: <AuthPage/>},
    {path: '/register', element: <RegisterPage/>},
    {path: '/publications', element: <PublicationsPage/>},
    {path: '/profile/:userId', element: <UserProfilePage/>},
    {path: '/user/:userId/settings', element: <UserSettingsPage/>}
]