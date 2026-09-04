import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { Bot } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0b0f] text-zinc-300">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 animate-pulse mb-4">
          <Bot size={32} />
        </div>
        <p className="text-sm font-medium tracking-wide text-zinc-400 font-mono">
          Loading NexusAI...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Register onSwitchToLogin={() => setAuthView('login')} />;
  }

  return <Chat />;
}

export default function App() {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}

function MainRouter() {
  const { isAuthenticated, loading } = useAuth();
  const [authPage, setAuthPage] = useState('login'); // 'login' | 'register'

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0b0f] text-zinc-300">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 animate-pulse mb-4">
          <Bot size={32} />
        </div>
        <p className="text-xs font-medium tracking-wide text-zinc-400 font-mono">
          Connecting to NexusAI...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authPage === 'login' ? (
      <Login onSwitchToRegister={() => setAuthPage('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthPage('login')} />
    );
  }

  return <Chat />;
}
