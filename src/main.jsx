import './index.css';
import {BrowserRouter} from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';

import {App} from './App.jsx';

export const queryClient = new QueryClient({defaultOptions:{queries:{staleTime:30000,gcTime:300000,retry:(count,error) => count < 2 && (!error.response || error.response.status >= 500),refetchOnWindowFocus:true}}});
ReactDOM.createRoot(document.getElementById('root')).render(<QueryClientProvider client={queryClient}><BrowserRouter><App/></BrowserRouter></QueryClientProvider>);
