import { useRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { routes } from "./routes.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { PublicationsRefreshProvider } from "./contexts/PublicationsRefreshContext.jsx";
import { CommentsRefreshProvider } from "./contexts/CommentsRefreshContext.jsx";

export const App = () => {
  let element = useRoutes(routes);

  return (
    <UserProvider>
      <PublicationsRefreshProvider>
        <CommentsRefreshProvider>
          <div>
            {element}
            <Toaster position="top-center" reverseOrder={false} />
          </div>
        </CommentsRefreshProvider>
      </PublicationsRefreshProvider>
    </UserProvider>
  );
};