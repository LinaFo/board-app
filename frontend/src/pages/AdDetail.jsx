import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAd, getComments, createComment, deleteComment, likeComment, likeAd, getAdLikes } from '../api';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeftIcon, 
  HeartIcon, 
  MessageCircleIcon,
  MapPinIcon,
  TagIcon,
  SendIcon,
  Trash2Icon
} from 'lucide-react';

export default function AdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchAd();
    fetchComments();
    fetchLikes();
  }, [id]);

  const fetchAd = async () => {
    try {
      const response = await getAd(id);
      setAd(response.data);
    } catch (error) {
      console.error('Ошибка загрузки объявления:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await getAdLikes(id);
      setLikesCount(response.data.likes);
    } catch (error) {
      console.error('Ошибка загрузки лайков:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createComment({ text: newComment, adId: id });
      setNewComment('');
      fetchComments();
    } catch (error) {
      alert('Ошибка отправки комментария');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Удалить комментарий?')) return;
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      alert('Ошибка удаления');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(commentId);
      fetchComments();
    } catch (error) {
      alert('Ошибка лайка');
    }
  };

  const handleLikeAd = async () => {
    if (!token) {
      alert('Войдите в систему, чтобы поставить лайк');
      return;
    }
    try {
      await likeAd(id);
      fetchLikes();
    } catch (error) {
      console.error('Ошибка лайка:', error);
      alert('Ошибка лайка');
    }
  };

  const goToChat = () => {
    if (!token) {
      alert('Войдите в систему, чтобы написать автору');
      return;
    }
    navigate('/chat', { state: { toUserId: ad.author_id } });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-pulse text-muted-foreground">Загрузка...</div>
    </div>
  );
  
  if (!ad) return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">😕</div>
      <h3 className="text-xl font-semibold mb-2">Объявление не найдено</h3>
      <Link to="/">
        <Button variant="outline" className="mt-4">Вернуться на главную</Button>
      </Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeftIcon className="h-4 w-4" />
        Назад к списку
      </Link>

      <Card className="overflow-hidden rounded-2xl">
        {ad.image_url && (
          <div className="aspect-video w-full overflow-hidden bg-muted rounded-t-2xl">
            <img
              src={`http://localhost:5000${ad.image_url}`}
              alt={ad.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        <CardHeader className="p-6">
          <CardTitle className="text-3xl font-bold">{ad.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              {ad.city}
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
            <span className="flex items-center gap-1">
              <TagIcon className="h-4 w-4" />
              {ad.category}
            </span>
          </div>

          <div className="mt-4 p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {ad.author_email ? ad.author_email[0].toUpperCase() : '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{ad.author_email}</p>
                  <p className="text-xs text-muted-foreground">ID: {ad.author_id}</p>
                </div>
              </div>
              {token && currentUserId != ad.author_id && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToChat}
                  className="rounded-full"
                >
                  <MessageCircleIcon className="h-4 w-4 mr-2" />
                  Написать автору
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground/80 leading-relaxed">{ad.description}</p>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <span className="text-3xl font-bold text-primary">{ad.price.toLocaleString()} ₽</span>
            
            <div className="flex items-center gap-3">
              <Button
                variant={likesCount > 0 ? "default" : "outline"}
                size="sm"
                onClick={handleLikeAd}
                className={`rounded-full gap-2 ${likesCount > 0 ? 'bg-primary hover:bg-primary/90' : ''}`}
              >
                <HeartIcon className={`h-4 w-4 ${likesCount > 0 ? 'fill-current' : ''}`} />
                {likesCount}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageCircleIcon className="h-5 w-5" />
          Комментарии
        </h3>

        {token && (
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
            <Input
              placeholder="Напишите комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 rounded-full"
            />
            <Button type="submit" size="icon" className="rounded-full">
              <SendIcon className="h-4 w-4" />
            </Button>
          </form>
        )}

        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircleIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Комментариев пока нет</p>
            {!token && <p className="text-sm">Войдите, чтобы оставить комментарий</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-muted/20 rounded-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {comment.email ? comment.email[0].toUpperCase() : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{comment.email}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1 break-words">{comment.text}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    {token && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeComment(comment.id)}
                          className="h-8 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                        >
                          ❤️ {comment.likes_count || 0}
                        </Button>
                        {currentUserId == comment.user_id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="h-8 px-2 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}