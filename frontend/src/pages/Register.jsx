// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
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
      await register({ email: form.email, password: form.password });
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-50 p-4">
      <Card className="w-full max-w-md shadow-lg border border-stone-200">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-normal text-stone-800">
            Регистрация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="example@mail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-stone-200 focus:border-stone-400 focus:ring-stone-400"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600 block">
                Пароль
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border-stone-200 focus:border-stone-400 focus:ring-stone-400"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600 block">
                Подтвердите пароль
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full border-stone-200 focus:border-stone-400 focus:ring-stone-400"
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
              className="w-full bg-stone-800 hover:bg-stone-700 text-white font-medium py-2.5 text-base transition-all shadow-sm"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>
          <p className="text-center text-sm text-stone-500 mt-6">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-stone-600 hover:text-stone-800 font-medium transition">
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}