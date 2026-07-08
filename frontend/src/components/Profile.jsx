// frontend/src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyAds, getLikedAds } from '../api';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { MapPinIcon, TagIcon, HeartIcon, PackageIcon, CameraIcon } from 'lucide-react';

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

  const renderAds = (ads, emptyMessage, icon) => {
    if (ads.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">{icon}</div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ads.map((ad) => (
          <Card key={ad.id} className="overflow-hidden rounded-2xl transition-all hover:shadow-md hover:-translate-y-0.5">
            {ad.image_url && (
              <div className="aspect-video w-full overflow-hidden bg-muted rounded-t-2xl">
                <img
                  src={`http://localhost:5000${ad.image_url}`}
                  alt={ad.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            )}
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold line-clamp-1">{ad.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="h-3 w-3" />
                <span>{ad.city}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                <TagIcon className="h-3 w-3" />
                <span>{ad.category}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ad.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">{ad.price.toLocaleString()} ₽</span>
                <div className="flex items-center gap-2">
                  {ad.likes_count > 0 && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      ❤️ {ad.likes_count}
                    </span>
                  )}
                  <Link to={`/ad/${ad.id}`}>
                    <Button variant="outline" size="sm" className="rounded-full">
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
        {activeTab === 'my-ads' && renderAds(myAds, 'У вас пока нет объявлений', '📦')}
        {activeTab === 'liked' && renderAds(likedAds, 'Вы ещё не лайкнули ни одного объявления', '❤️')}
      </div>
    </div>
  );
}