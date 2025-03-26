
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageSquare, Share, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock data for posts
const initialPosts = [
  {
    id: 1,
    author: {
      name: 'Алексей Петров',
      avatar: '',
    },
    title: 'Экологические инициативы в Москве',
    content: 'Сегодня в Москве запустили новую программу по сортировке отходов. Теперь в каждом дворе будут установлены специальные контейнеры для разных видов мусора.',
    createdAt: '2 часа назад',
    likes: 24,
    comments: 5,
    shares: 3,
    liked: false,
  },
  {
    id: 2,
    author: {
      name: 'Екатерина Иванова',
      avatar: '',
    },
    title: 'Как уменьшить свой углеродный след',
    content: 'Я начала вести экологичный образ жизни месяц назад. Вот несколько простых советов, которые помогли мне уменьшить свой углеродный след: 1. Используйте многоразовые сумки 2. Откажитесь от пластиковых трубочек 3. Экономьте воду и электроэнергию',
    createdAt: '5 часов назад',
    likes: 42,
    comments: 12,
    shares: 8,
    liked: false,
  },
];

export const Feed = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [posts, setPosts] = useState(initialPosts);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: {
        name: user?.username || 'Anonymous',
        avatar: user?.avatar || '',
      },
      title: newPostTitle,
      content: newPostContent,
      createdAt: t('language') === 'ru' ? 'только что' : 'just now',
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setIsCreatePostOpen(false);
    
    toast({
      title: t('language') === 'ru' ? 'Пост опубликован!' : 'Post published!',
      description: t('language') === 'ru' ? 'Ваш пост успешно опубликован.' : 'Your post has been published successfully.',
    });
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked,
        };
      }
      return post;
    }));
  };

  const handleShare = (postId: number) => {
    toast({
      title: t('language') === 'ru' ? 'Поделиться' : 'Share',
      description: t('language') === 'ru' ? 'Функция "Поделиться" будет доступна скоро.' : 'Share functionality coming soon.',
    });

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          shares: post.shares + 1,
        };
      }
      return post;
    }));
  };

  return (
    <AppLayout title={t('news')}>
      <div className="space-y-6 py-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
              <DialogTrigger asChild>
                <div className="flex items-center space-x-4 cursor-pointer">
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted rounded-full p-3 text-muted-foreground text-sm">
                    {t('whatThinking')}
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('createPost')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('postTitle')}</Label>
                    <Input
                      id="title"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder={t('language') === 'ru' ? 'Заголовок поста' : 'Post title'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">{t('postContent')}</Label>
                    <Textarea
                      id="content"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder={t('language') === 'ru' ? 'О чём вы думаете?' : 'What are you thinking?'}
                      className="min-h-32"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {t('language') === 'ru' ? 'Добавить фото' : 'Add Photo'}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleCreatePost}>{t('publish')}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {posts.map((post) => (
          <Card key={post.id} className="glass-card overflow-hidden scale-transition">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-xs text-muted-foreground">{post.createdAt}</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mt-4">{post.title}</h3>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="whitespace-pre-line">{post.content}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center ${post.liked ? 'text-red-500' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <Heart className={`h-4 w-4 mr-2 ${post.liked ? 'fill-current' : ''}`} />
                {post.likes} {t('like')}
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                {post.comments} {t('comment')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center"
                onClick={() => handleShare(post.id)}
              >
                <Share className="h-4 w-4 mr-2" />
                {post.shares} {t('share')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
};
