import { createRoot } from 'react-dom/client';
import { App } from './app.tsx'
import './index.css'

createRoot(document.getElementById('app')!).render(<App />)
