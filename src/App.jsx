import { useRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { routes } from "./routes.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";

export const App = () => {
  let element = useRoutes(routes);

  return (
    <UserProvider>
      <div>
        {element}
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </UserProvider>
  );
};