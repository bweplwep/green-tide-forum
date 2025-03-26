
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Eye, Clock, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock data for forum topics
const initialTopics = [
  {
    id: 1,
    title: 'Как уменьшить углеродный след в повседневной жизни?',
    category: 'lifestyle',
    author: {
      name: 'Алексей Петров',
      avatar: '',
    },
    replies: 12,
    views: 345,
    lastReply: '2 часа назад',
    content: 'Привет всем! Я недавно начал интересоваться экологией и хочу узнать, какие простые шаги можно предпринять для уменьшения своего углеродного следа в повседневной жизни. Поделитесь своим опытом!',
    tags: ['lifestyle', 'carbon', 'tips'],
  },
  {
    id: 2,
    title: 'Обсуждение электромобилей: за и против',
    category: 'transport',
    author: {
      name: 'Екатерина Иванова',
      avatar: '',
    },
    replies: 28,
    views: 572,
    lastReply: '5 часов назад',
    content: 'Хочу приобрести электромобиль, но слышала разные мнения об их экологичности. Насколько они действительно "зеленые"? Какие есть плюсы и минусы по сравнению с обычными автомобилями?',
    tags: ['transport', 'electric', 'cars'],
  },
  {
    id: 3,
    title: 'Переработка пластика: как правильно сортировать отходы',
    category: 'waste',
    author: {
      name: 'Иван Смирнов',
      avatar: '',
    },
    replies: 15,
    views: 289,
    lastReply: '1 день назад',
    content: 'Недавно узнал, что не весь пластик можно перерабатывать. Давайте обсудим, как правильно сортировать отходы и что делать с тем, что не подлежит переработке.',
    tags: ['waste', 'recycling', 'plastic'],
  },
];

// Category data
const categories = [
  { value: 'all', label: { ru: 'Все категории', en: 'All Categories' } },
  { value: 'lifestyle', label: { ru: 'Образ жизни', en: 'Lifestyle' } },
  { value: 'transport', label: { ru: 'Транспорт', en: 'Transport' } },
  { value: 'waste', label: { ru: 'Отходы', en: 'Waste Management' } },
  { value: 'energy', label: { ru: 'Энергия', en: 'Energy' } },
  { value: 'food', label: { ru: 'Питание', en: 'Food' } },
];

export const Forum = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [topics, setTopics] = useState(initialTopics);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTopics, setFilteredTopics] = useState(topics);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [createTopicOpen, setCreateTopicOpen] = useState(false);
  
  // New topic form state
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  
  // Filter topics based on search and category
  const filterTopics = () => {
    let filtered = topics;
    
    if (searchQuery) {
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(topic => topic.category === selectedCategory);
    }
    
    setFilteredTopics(filtered);
  };
  
  // Handle search
  const handleSearch = () => {
    filterTopics();
  };
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    let filtered = topics;
    
    if (value !== 'all') {
      filtered = filtered.filter(topic => topic.category === value);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredTopics(filtered);
  };
  
  // Create new topic
  const handleCreateTopic = () => {
    if (!newTopicTitle.trim() || !newTopicCategory || !newTopicContent.trim()) {
      toast({
        variant: 'destructive',
        title: language === 'ru' ? 'Ошибка' : 'Error',
        description: language === 'ru' 
          ? 'Пожалуйста, заполните все поля' 
          : 'Please fill out all fields',
      });
      return;
    }
    
    const newTopic = {
      id: Date.now(),
      title: newTopicTitle,
      category: newTopicCategory,
      author: {
        name: user?.username || 'Anonymous',
        avatar: user?.avatar || '',
      },
      replies: 0,
      views: 0,
      lastReply: language === 'ru' ? 'только что' : 'just now',
      content: newTopicContent,
      tags: [newTopicCategory],
    };
    
    const updatedTopics = [newTopic, ...topics];
    setTopics(updatedTopics);
    setFilteredTopics(selectedCategory === 'all' || selectedCategory === newTopicCategory 
      ? [newTopic, ...filteredTopics] 
      : filteredTopics
    );
    
    // Reset form
    setNewTopicTitle('');
    setNewTopicCategory('');
    setNewTopicContent('');
    setCreateTopicOpen(false);
    
    toast({
      title: language === 'ru' ? 'Тема создана' : 'Topic created',
      description: language === 'ru' 
        ? 'Ваша тема была успешно опубликована' 
        : 'Your topic has been successfully published',
    });
  };
  
  // Get category label
  const getCategoryLabel = (value: string) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label[language as 'ru' | 'en'] : value;
  };
  
  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lifestyle':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'transport':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'waste':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'energy':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'food':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <AppLayout title={t('forum')}>
      <div className="space-y-6 py-4">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>{t('discussions')}</CardTitle>
              <Dialog open={createTopicOpen} onOpenChange={setCreateTopicOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    {t('createTopic')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('createTopic')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">{t('topicTitle')}</Label>
                      <Input
                        id="title"
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        placeholder={language === 'ru' ? 'Название темы' : 'Topic title'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">{t('category')}</Label>
                      <Select value={newTopicCategory} onValueChange={setNewTopicCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder={language === 'ru' ? 'Выберите категорию' : 'Select category'} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label[language as 'ru' | 'en']}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">{t('topicContent')}</Label>
                      <Textarea
                        id="content"
                        value={newTopicContent}
                        onChange={(e) => setNewTopicContent(e.target.value)}
                        placeholder={language === 'ru' ? 'Содержание темы' : 'Topic content'}
                        className="min-h-32"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleCreateTopic}>{language === 'ru' ? 'Опубликовать' : 'Publish'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                </div>
                <Button onClick={handleSearch}>{language === 'ru' ? 'Поиск' : 'Search'}</Button>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto py-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryChange(category.value)}
                  >
                    {category.label[language as 'ru' | 'en']}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <Card key={topic.id} className="overflow-hidden scale-transition">
                <div className="md:flex">
                  <div className="md:flex-1 p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={topic.author.avatar} />
                        <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold text-lg">{topic.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>{topic.author.name}</span>
                            <span>•</span>
                            <span>{topic.lastReply}</span>
                          </div>
                        </div>
                        
                        <Badge className={getCategoryColor(topic.category)}>
                          {getCategoryLabel(topic.category)}
                        </Badge>
                        
                        <p className="text-sm line-clamp-2">{topic.content}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-48 p-4 bg-secondary/50 flex md:flex-col justify-around md:justify-center items-center gap-4 md:gap-2 border-t md:border-t-0 md:border-l">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {topic.replies} {language === 'ru' ? 'ответов' : 'replies'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {topic.views} {language === 'ru' ? 'просмотров' : 'views'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Search className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">
                      {language === 'ru' ? 'Темы не найдены' : 'No topics found'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'ru' 
                        ? 'Попробуйте другой поисковый запрос или категорию' 
                        : 'Try a different search term or category'}
                    </p>
                  </div>
                  <Button onClick={() => setCreateTopicOpen(true)}>
                    {language === 'ru' ? 'Создать новую тему' : 'Create a new topic'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
