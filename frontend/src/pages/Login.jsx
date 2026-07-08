// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('userEmail', response.data.user.email);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Ошибка входа');
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
            Войдите в свой аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
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
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          <p className="text-center text-sm text-stone-500 mt-6">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-amber-600 hover:text-amber-700 font-medium hover:underline transition">
              Зарегистрироваться
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}