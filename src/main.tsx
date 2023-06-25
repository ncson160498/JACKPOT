import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Toaster } from 'react-hot-toast';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThirdwebProvider activeChain="mumbai">
      <App />
      <Toaster/>
    </ThirdwebProvider>
  </React.StrictMode>,
)
