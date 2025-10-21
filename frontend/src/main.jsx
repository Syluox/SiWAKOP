import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ⬅️ IMPORT THIS
import App from './App';
import UserDashboard from './pages/UserPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* ⬅️ WRAP App component with BrowserRouter */}
    <BrowserRouter> 
      <App /> 
    </BrowserRouter>
  </React.StrictMode>
);