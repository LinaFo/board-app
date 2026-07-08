// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '',
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ 
        name: form.name, 
        email: form.email, 
        password: form.password 
      });
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50/40 via-white to-rose-50/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-amber-200">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center text-5xl mb-2">🕳️</div>
          <CardTitle className="text-3xl font-semibold text-stone-800">
            Учебная нора
          </CardTitle>
          <CardDescription className="text-stone-500 text-base">
            Создайте аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 block">
                Имя
              </label>
              <Input
                type="text"
                placeholder="Ваше имя"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-stone-200 focus:border-amber-400 focus:ring-amber-400"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="example@mail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-stone-200 focus:border-amber-400 focus:ring-amber-400"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 block">
                Пароль
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border-stone-200 focus:border-amber-400 focus:ring-amber-400"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 block">
                Подтвердите пароль
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full border-stone-200 focus:border-amber-400 focus:ring-amber-400"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2.5 text-base transition-all shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>
          <p className="text-center text-sm text-stone-500 mt-6">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium hover:underline transition">
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}