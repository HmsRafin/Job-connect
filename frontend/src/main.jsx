import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { PlatformProvider } from './context/PlatformContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <PlatformProvider>
        <App />
      </PlatformProvider>
    </AuthProvider>
  </React.StrictMode>,
);
