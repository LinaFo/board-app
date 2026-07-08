// frontend/src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyAds, getLikedAds, deleteAd } from '../api';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPinIcon, 
  TagIcon, 
  HeartIcon, 
  PackageIcon, 
  CameraIcon,
  Trash2Icon
} from 'lucide-react';

export default function Profile() {
  const [myAds, setMyAds] = useState([]);
  const [likedAds, setLikedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-ads');
  const userEmail = localStorage.getItem('userEmail');
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem('userAvatar') || '');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [myAdsRes, likedAdsRes] = await Promise.all([
        getMyAds(),
        getLikedAds(),
      ]);
      setMyAds(myAdsRes.data);
      setLikedAds(likedAdsRes.data);
    } catch (error) {
      console.error('Ошибка загрузки данных профиля:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const avatarUrl = event.target.result;
        setUserAvatar(avatarUrl);
        localStorage.setItem('userAvatar', avatarUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAd = async (adId) => {
    if (!window.confirm('Удалить это объявление?')) return;
    try {
      await deleteAd(adId);
      fetchData();
    } catch (error) {
      alert('Ошибка удаления');
    }
  };

  const renderAds = (ads, emptyMessage, icon, showDelete = false) => {
    if (ads.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">{icon}</div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {ads.map((ad) => (
          <Card key={ad.id} className="overflow-hidden rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5">
            {ad.image_url && (
              <div className="aspect-square w-full overflow-hidden bg-muted">
                <img
                  src={`http://localhost:5000${ad.image_url}`}
                  alt={ad.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            )}
            <CardHeader className="p-2.5 pb-0">
              <div className="flex items-start justify-between gap-1">
                <CardTitle className="text-sm font-semibold line-clamp-1 flex-1">
                  {ad.title}
                </CardTitle>
                {showDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAd(ad.id)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPinIcon className="h-2.5 w-2.5" />
                <span className="truncate">{ad.city}</span>
                <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/30"></span>
                <TagIcon className="h-2.5 w-2.5" />
                <span className="truncate">{ad.category}</span>
              </div>
            </CardHeader>
            <CardContent className="p-2.5 pt-1.5 space-y-1.5">
              <p className="text-xs text-muted-foreground line-clamp-1">
                {ad.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">{ad.price.toLocaleString()} ₽</span>
                <div className="flex items-center gap-1">
                  {ad.likes_count > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      ❤️ {ad.likes_count}
                    </span>
                  )}
                  <Link to={`/ad/${ad.id}`}>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs rounded-full">
                      Открыть
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Профиль с аватаркой */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 ring-2 ring-primary/10">
              {userAvatar && <AvatarImage src={userAvatar} />}
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
                {userEmail ? userEmail[0].toUpperCase() : '?'}
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
              <CameraIcon className="h-4 w-4 text-primary-foreground" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{userEmail || 'Пользователь'}</h1>
            <p className="text-muted-foreground">ID: {localStorage.getItem('userId')}</p>
            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
              <span>📦 {myAds.length} объявлений</span>
              <span>❤️ {likedAds.length} лайков</span>
            </div>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="flex gap-2 mb-6 border-b pb-2">
        <Button
          variant={activeTab === 'my-ads' ? 'default' : 'outline'}
          onClick={() => setActiveTab('my-ads')}
          className="rounded-full"
        >
          <PackageIcon className="h-4 w-4 mr-2" />
          Мои объявления ({myAds.length})
        </Button>
        <Button
          variant={activeTab === 'liked' ? 'default' : 'outline'}
          onClick={() => setActiveTab('liked')}
          className="rounded-full"
        >
          <HeartIcon className="h-4 w-4 mr-2" />
          Лайкнутые ({likedAds.length})
        </Button>
      </div>

      <div>
        {activeTab === 'my-ads' && renderAds(myAds, 'У вас пока нет объявлений', '📦', true)}
        {activeTab === 'liked' && renderAds(likedAds, 'Вы ещё не лайкнули ни одного объявления', '❤️', false)}
      </div>
    </div>
  );
}