import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAd } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CreateAd() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (image) formData.append('image', image);

    try {
      await createAd(formData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Ошибка создания');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Создать объявление</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Заголовок"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Textarea
          placeholder="Описание"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Цена"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <Input
          placeholder="Город"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          required
        />
        <select
          className="w-full border rounded-lg px-4 py-2"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">Выберите категорию</option>
          <option value="Недвижимость">Недвижимость</option>
          <option value="Авто">Авто</option>
          <option value="Электроника">Электроника</option>
          <option value="Услуги">Услуги</option>
          <option value="Работа">Работа</option>
        </select>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Создание...' : 'Создать объявление'}
        </Button>
      </form>
    </div>
  );
}