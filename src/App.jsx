import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AuthPage      from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import Toast         from './components/Toast';

function AppContent() {
  const { currentUser, loading } = useApp();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--hbg)',
        color: '#fff',
        fontSize: '14px',
        fontFamily: 'var(--font)',
      }}>
        Loading…
      </div>
    );
  }

  return (
    <>
      {currentUser ? <DashboardPage /> : <AuthPage />}
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
