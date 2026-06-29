import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import { GoogleOAuthProvider }
from "@react-oauth/google";

import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Setup from './pages/Setup';
import Workout from "./pages/Workout";
import WorkoutSummary from "./pages/WorkoutSummary";
import WorkoutCalendar from "./pages/WorkoutCalendar";

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/workout-summary" element={<WorkoutSummary />} />
        <Route path="/history" element={<WorkoutCalendar />} />
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>
);