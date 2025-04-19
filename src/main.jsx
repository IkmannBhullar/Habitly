import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // ✅ Add this
import { Toaster } from 'react-hot-toast'; // ✅ Already imported

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ Wrap everything in router */}
      <App />
      <Toaster position="top-center" />
    </BrowserRouter>
  </StrictMode>
);
