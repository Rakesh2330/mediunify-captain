import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { NotificationProvider } from './context/NotificationContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <TaskProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </TaskProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
