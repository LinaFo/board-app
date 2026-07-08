// frontend/src/pages/Chat.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon, UserIcon, MessageCircleIcon } from 'lucide-react';

const socket = io('http://localhost:5000');

export default function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [toUserId, setToUserId] = useState(location.state?.toUserId || '');
  const currentUserId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUserId) {
      console.log('📦 Присоединяюсь к комнате user-' + currentUserId);
      socket.emit('join-room', currentUserId);
    }

    socket.on('joined-room', (data) => {
      console.log('✅ Подтверждение: присоединился к', data.room);
    });

    socket.on('new-message', (data) => {
      console.log('📩 Получено сообщение:', data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('new-message');
      socket.off('joined-room');
    };
  }, [currentUserId]);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !toUserId) {
      console.warn('⚠️ Нет текста или ID получателя');
      return;
    }

    console.log(`📤 Отправляю сообщение пользователю ${toUserId}: "${text}"`);
    socket.emit('send-message', { toUserId, text });
    setMessages((prev) => [...prev, { 
      from: 'me', 
      text, 
      timestamp: new Date().toISOString() 
    }]);
    setText('');
  };

  // Форматирование времени
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto">
      {/* Шапка чата */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <UserIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Чат</h2>
          <p className="text-sm text-muted-foreground">
            {toUserId ? `Собеседник ID: ${toUserId}` : 'Введите ID собеседника'}
          </p>
        </div>
      </div>

      {/* Поле для ID собеседника */}
      <div className="mb-4">
        <Input
          placeholder="ID собеседника (например, 2)"
          value={toUserId}
          onChange={(e) => setToUserId(e.target.value)}
          className="rounded-full"
        />
        {!toUserId && (
          <p className="text-xs text-muted-foreground mt-1">
            Введите ID пользователя, чтобы начать диалог
          </p>
        )}
      </div>

      {/* Область сообщений */}
      <div className="flex-1 border rounded-2xl bg-muted/10 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageCircleIcon className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-sm">Сообщений пока нет</p>
            <p className="text-xs">Начните диалог, отправив сообщение</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.from === 'me';
            return (
              <div
                key={index}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {toUserId ? toUserId[0].toUpperCase() : 'С'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  {isMe && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {userEmail ? userEmail[0].toUpperCase() : 'Я'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <form onSubmit={sendMessage} className="flex gap-2 mt-4">
        <Input
          placeholder="Сообщение..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-full"
          disabled={!toUserId}
        />
        <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!toUserId || !text.trim()}>
          <SendIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}