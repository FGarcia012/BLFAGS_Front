import {Suspense,Component} from 'react';
import {useRoutes} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import {routes} from './routes.jsx';
import {UserProvider} from './contexts/UserContext.jsx';
import {Navbar} from './components/navbar/Navbar.jsx';
import {Footer} from './components/footer/Footer.jsx';
import {Spinner,ErrorState} from './components/ui/index.jsx';
class ErrorBoundary extends Component {
 state = {failed:false};
 static getDerivedStateFromError() {return {failed:true};}
 render() {return this.state.failed ? <ErrorState retry={() => window.location.reload()}>Ocurrió un error. Vuelve a cargar la página.</ErrorState>:this.props.children;}
}
function Content() {const element = useRoutes(routes); return <><Navbar/><main id="main" className="site-main"><Suspense fallback={<div className="loading-page"><Spinner/></div>}>{element}</Suspense></main><Footer/></>;}
export function App() {return <ErrorBoundary><UserProvider><Content/><Toaster position="top-center" toastOptions={{className:'app-toast'}}/></UserProvider></ErrorBoundary>;}
