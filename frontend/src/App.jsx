// frontend/src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { MenuIcon, LogInIcon, UserPlusIcon } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateAd from './pages/CreateAd';
import MyAds from './pages/MyAds';
import AdDetail from './pages/AdDetail';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {token && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <MenuIcon className="h-5 w-5 text-foreground" />
              </button>
            )}
            <Link to="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
              Доска объявлений
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {!token && (
              <>
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted rounded-full transition-colors">
                  <LogInIcon className="h-4 w-4" />
                  Вход
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-colors shadow-sm">
                  <UserPlusIcon className="h-4 w-4" />
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreateAd />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-ads" element={<MyAds />} />
          <Route path="/ad/:id" element={<AdDetail />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;