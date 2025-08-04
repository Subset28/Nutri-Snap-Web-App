import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@capacitor-community/safe-area';
import { StatusBar, Style } from '@capacitor/status-bar';

createRoot(document.getElementById("root")!).render(<App />);

StatusBar.setStyle({ style: Style.Default });
