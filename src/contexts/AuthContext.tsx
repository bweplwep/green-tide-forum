
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  lastSeen?: Date;
  friends?: number;
  likes?: number;
  language: 'ru' | 'en';
  theme: 'light' | 'dark';
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  setLanguage: (lang: 'ru' | 'en') => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    username: 'eco_user',
    email: 'user@eco.com',
    password: 'password',
    avatar: '',
    bio: 'Эколог и любитель природы',
    lastSeen: new Date(),
    friends: 24,
    likes: 142,
    language: 'ru' as const,
    theme: 'light' as const,
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('ecoUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('ecoUser', JSON.stringify(userWithoutPassword));
        toast({
          title: userWithoutPassword.language === 'ru' ? 'Успешный вход' : 'Login successful',
          description: userWithoutPassword.language === 'ru' ? 'Добро пожаловать!' : 'Welcome back!',
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: (error as Error).message || 'Failed to login',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const newUser: User = {
        id: String(mockUsers.length + 1),
        username,
        email,
        avatar: '',
        bio: '',
        lastSeen: new Date(),
        friends: 0,
        likes: 0,
        language: 'ru',
        theme: 'light',
      };

      // In a real app, we would save to DB here
      mockUsers.push({ ...newUser, password });
      
      setUser(newUser);
      localStorage.setItem('ecoUser', JSON.stringify(newUser));
      
      toast({
        title: 'Регистрация успешна',
        description: 'Добро пожаловать в ЭкоСообщество!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Registration Error',
        description: (error as Error).message || 'Failed to register',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecoUser');
    toast({
      title: user?.language === 'ru' ? 'Выход выполнен' : 'Logged out',
      description: user?.language === 'ru' ? 'До скорой встречи!' : 'See you soon!',
    });
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('ecoUser', JSON.stringify(updatedUser));
      
      toast({
        title: user.language === 'ru' ? 'Профиль обновлен' : 'Profile updated',
        description: user.language === 'ru' ? 'Изменения сохранены' : 'Changes saved successfully',
      });
    }
  };

  const setLanguage = (lang: 'ru' | 'en') => {
    if (user) {
      updateProfile({ language: lang });
    }
  };

  const setTheme = (theme: 'light' | 'dark') => {
    if (user) {
      updateProfile({ theme });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        setLanguage,
        setTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
