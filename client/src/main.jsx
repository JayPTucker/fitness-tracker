import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);