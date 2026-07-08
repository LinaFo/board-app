// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { getAds } from '../api';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, MapPinIcon, TagIcon } from 'lucide-react';

const categories = ['Все', 'Недвижимость', 'Авто', 'Электроника', 'Услуги', 'Работа'];
const cities = ['Все', 'Москва', 'СПб', 'Екатеринбург', 'Казань', 'Новосибирск'];

export default function Home() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', city: '', search: '', page: 1 });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAds();
  }, [filters]);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category && filters.category !== 'Все') params.category = filters.category;
      if (filters.city && filters.city !== 'Все') params.city = filters.city;
      if (filters.search) params.search = filters.search;
      params.page = filters.page;
      params.limit = 10;
      
      const response = await getAds(params);
      setAds(response.data);
      setTotalPages(response.data.length === 10 ? filters.page + 1 : filters.page);
    } catch (error) {
      console.error('Ошибка загрузки объявлений:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Поиск */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Поиск объявлений..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10 h-12 rounded-2xl border-muted-foreground/20 focus:border-primary"
          />
        </div>
      </form>

      {/* Фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-muted-foreground/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-muted-foreground/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Список объявлений */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse rounded-2xl overflow-hidden">
              <CardHeader className="p-4">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                  <div className="h-9 bg-muted rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          Подробнее
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {ads.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Объявлений не найдено</h3>
              <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
            </div>
          )}

          {/* Пагинация */}
          <div className="flex justify-center items-center gap-3 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="rounded-full"
            >
              ← Назад
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Страница {filters.page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === totalPages}
              className="rounded-full"
            >
              Вперёд →
            </Button>
          </div>
        </>
      )}
    </div>
  );
}