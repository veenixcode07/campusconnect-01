import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { QueryProvider } from './contexts/QueryContext'
import { AppProvider } from './contexts/AppContext'

createRoot(document.getElementById("root")!).render(
  <App />
);
