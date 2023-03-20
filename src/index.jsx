import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.css'
import HttpsRedirect from 'react-https-redirect';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HttpsRedirect>
      <App />
    </HttpsRedirect>
  </React.StrictMode>
);
