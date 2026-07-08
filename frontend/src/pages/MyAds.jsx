// frontend/src/pages/MyAds.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyAds, deleteAd } from '../api';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPinIcon, TagIcon, Trash2Icon } from 'lucide-react';

export default function MyAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await getMyAds();
      setAds(response.data);
    } catch (error) {
      console.error('Ошибка загрузки объявлений:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить объявление?')) return;
    try {
      await deleteAd(id);
      setAds(ads.filter(ad => ad.id !== id));
    } catch (error) {
      alert('Ошибка удаления');
    }
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Мои объявления</h2>
      {ads.length === 0 ? (
        <p className="text-gray-500">У вас пока нет объявлений</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <Card key={ad.id} className="overflow-hidden rounded-2xl transition-all hover:shadow-md">
              {ad.image_url && (
                <div className="aspect-video w-full overflow-hidden bg-muted rounded-t-2xl">
                  <img
                    src={`http://localhost:5000${ad.image_url}`}
                    alt={ad.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold line-clamp-1">{ad.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(ad.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="h-3 w-3" />
                  <span>{ad.city}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                  <TagIcon className="h-3 w-3" />
                  <span>{ad.category}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{ad.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">{ad.price} ₽</span>
                  <Link to={`/ad/${ad.id}`}>
                    <Button variant="outline" size="sm" className="rounded-full">
                      Открыть
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}