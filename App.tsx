/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <Toaster 
            position="top-right" 
            toastOptions={{ 
              className: 'dark:bg-gray-800 dark:text-white',
              style: {
                background: 'var(--tw-colors-gray-800)',
                color: 'var(--tw-colors-white)'
              }
            }} 
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

