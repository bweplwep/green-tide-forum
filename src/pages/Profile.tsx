
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Heart, Settings, LogOut, MessageSquare, Globe } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

export const Profile = () => {
  const { user, logout, updateProfile, setLanguage, setTheme: setUserTheme } = useAuth();
  const { t, language, setLanguage: changeLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleUpdateProfile = () => {
    updateProfile({
      username,
      bio,
    });
    setEditMode(false);
    
    toast({
      title: t('language') === 'ru' ? 'Профиль обновлен' : 'Profile updated',
      description: t('language') === 'ru' ? 'Ваш профиль успешно обновлен' : 'Your profile has been updated successfully',
    });
  };

  const handleLanguageChange = (value: 'ru' | 'en') => {
    setLanguage(value);
    changeLanguage(value);
  };

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    setUserTheme(newTheme);
  };

  const handleLogout = () => {
    logout();
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return format(date, 'PP', { locale: language === 'ru' ? ru : enUS });
  };

  return (
    <AppLayout title={t('profile')}>
      <div className="space-y-6 py-4">
        <Card className="glass-card overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-eco-800 to-eco-600" />
          <div className="px-4 pb-4 relative">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 border-4 border-background absolute -top-12">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-xl">{user?.username?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="mt-14 text-center">
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              {user?.bio && (
                <p className="text-muted-foreground mt-2">{user.bio}</p>
              )}
              
              <div className="flex justify-center space-x-8 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-semibold">{user?.friends || 0}</p>
                  <p className="text-sm text-muted-foreground">{t('friends')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold">{user?.likes || 0}</p>
                  <p className="text-sm text-muted-foreground">{t('likes')}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <Dialog open={editMode} onOpenChange={setEditMode}>
                  <DialogTrigger asChild>
                    <Button variant="outline">{t('editProfile')}</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('editProfile')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -right-2 -bottom-2 bg-primary rounded-full p-1">
                            <Camera className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">{t('username')}</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">{t('bio')}</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder={t('language') === 'ru' ? 'Расскажите о себе...' : 'Write something about yourself...'}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleUpdateProfile}>{t('language') === 'ru' ? 'Сохранить' : 'Save'}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </Card>
        
        <Tabs defaultValue="activity">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="activity">{t('language') === 'ru' ? 'Активность' : 'Activity'}</TabsTrigger>
            <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('language') === 'ru' ? 'Последняя активность' : 'Recent Activity'}</CardTitle>
                <CardDescription>
                  {t('language') === 'ru' 
                    ? `Последний вход: ${user?.lastSeen ? formatDate(user.lastSeen) : 'Неизвестно'}`
                    : `Last seen: ${user?.lastSeen ? formatDate(user.lastSeen) : 'Unknown'}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center p-3 bg-secondary rounded-lg">
                  <Heart className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p>{t('language') === 'ru' ? 'Вам понравился пост' : 'You liked a post'}</p>
                    <p className="text-sm text-muted-foreground">{t('language') === 'ru' ? '2 часа назад' : '2 hours ago'}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-secondary rounded-lg">
                  <MessageSquare className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p>{t('language') === 'ru' ? 'Вы оставили комментарий' : 'You commented on a post'}</p>
                    <p className="text-sm text-muted-foreground">{t('language') === 'ru' ? '5 часов назад' : '5 hours ago'}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-secondary rounded-lg">
                  <Globe className="h-5 w-5 text-eco-600 mr-3" />
                  <div>
                    <p>{t('language') === 'ru' ? 'Вы сравнили экологичность продуктов' : 'You compared eco-friendliness'}</p>
                    <p className="text-sm text-muted-foreground">{t('language') === 'ru' ? '1 день назад' : '1 day ago'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t('language')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('language') === 'ru' ? 'Выберите язык приложения' : 'Choose application language'}
                      </p>
                    </div>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ru">Русский</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t('theme')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('language') === 'ru' ? 'Тёмная тема' : 'Dark mode'}
                      </p>
                    </div>
                    <Switch 
                      checked={theme === 'dark'}
                      onCheckedChange={handleThemeChange}
                    />
                  </div>
                </div>
                
                <Button variant="destructive" onClick={handleLogout} className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('logout')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};
