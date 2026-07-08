// frontend/src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyAds, getLikedAds } from '../api';
import { 
  Avatar, 
  AvatarFallback,
  AvatarImage 
} from '@/components/ui/avatar';
import { 
  UserIcon,
  MessageCircleIcon, 
  PlusCircleIcon, 
  LogOutIcon,
  PackageIcon,
  HeartIcon
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [myAdsCount, setMyAdsCount] = useState(0);
  const [likedAdsCount, setLikedAdsCount] = useState(0);
  const userEmail = localStorage.getItem('userEmail');
  const userAvatar = localStorage.getItem('userAvatar');

  useEffect(() => {
    if (isOpen) {
      fetchCounts();
    }
  }, [isOpen]);

  const fetchCounts = async () => {
    try {
      const [myAdsRes, likedAdsRes] = await Promise.all([
        getMyAds(),
        getLikedAds(),
      ]);
      setMyAdsCount(myAdsRes.data.length);
      setLikedAdsCount(likedAdsRes.data.length);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userAvatar');
    onClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-background border-r shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Шапка с аватаркой и почтой */}
        <div className="p-6 border-b">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-20 w-20 ring-2 ring-primary/10">
              {userAvatar && <AvatarImage src={userAvatar} />}
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
                {userEmail ? userEmail[0].toUpperCase() : '?'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold text-foreground text-lg">
                {userEmail || 'Пользователь'}
              </p>
            </div>
          </div>
        </div>

        {/* Меню */}
        <div className="p-4 space-y-1">
          <button
            onClick={() => handleNavigation('/profile')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors group"
          >
            <UserIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="flex-1 text-left text-sm font-medium text-foreground/80 group-hover:text-foreground">
              Профиль
            </span>
            <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {myAdsCount + likedAdsCount}
            </span>
          </button>

          <button
            onClick={() => handleNavigation('/chat')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors group"
          >
            <MessageCircleIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="flex-1 text-left text-sm font-medium text-foreground/80 group-hover:text-foreground">
              Чат
            </span>
          </button>

          <button
            onClick={() => handleNavigation('/create')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors group"
          >
            <PlusCircleIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="flex-1 text-left text-sm font-medium text-foreground/80 group-hover:text-foreground">
              Создать объявление
            </span>
          </button>

          <hr className="my-3 border-muted" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 transition-colors group"
          >
            <LogOutIcon className="h-5 w-5 text-destructive/70 group-hover:text-destructive" />
            <span className="text-sm font-medium text-destructive/70 group-hover:text-destructive">
              Выйти
            </span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-muted">
          <p className="text-xs text-center text-muted-foreground">
            Доска объявлений v1.0
          </p>
        </div>
      </div>
    </>
  );
}