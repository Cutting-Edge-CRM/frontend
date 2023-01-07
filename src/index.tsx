import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.css'

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
