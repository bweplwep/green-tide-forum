
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define all translations
export const translations = {
  ru: {
    // Auth
    login: 'Вход',
    register: 'Регистрация',
    email: 'Электронная почта',
    password: 'Пароль',
    username: 'Имя пользователя',
    confirmPassword: 'Подтвердите пароль',
    submitLogin: 'Войти',
    submitRegister: 'Зарегистрироваться',
    noAccount: 'Нет аккаунта?',
    haveAccount: 'Уже есть аккаунт?',
    
    // Navigation
    news: 'Новости',
    profile: 'Профиль',
    ecoCompare: 'Эко Сравнение',
    forum: 'Форум',
    
    // News Feed
    createPost: 'Создать пост',
    whatThinking: 'О чём вы думаете?',
    postTitle: 'Заголовок',
    postContent: 'Содержание',
    publish: 'Опубликовать',
    like: 'Нравится',
    comment: 'Комментировать',
    share: 'Поделиться',
    comments: 'Комментарии',
    viewComments: 'Просмотреть комментарии',
    writeComment: 'Написать комментарий...',
    
    // Profile
    editProfile: 'Редактировать профиль',
    bio: 'О себе',
    friends: 'Друзья',
    posts: 'Публикации',
    likes: 'Лайки',
    lastSeen: 'Последний раз в сети',
    settings: 'Настройки',
    logout: 'Выйти',
    language: 'Язык',
    theme: 'Тема',
    dark: 'Тёмная',
    light: 'Светлая',
    
    // Eco Compare
    compareTitle: 'Сравнить экологичность',
    searchProduct: 'Поиск продукта',
    category: 'Категория',
    compare: 'Сравнить',
    ecoRating: 'Эко-рейтинг',
    carbonFootprint: 'Углеродный след',
    materials: 'Материалы',
    recycling: 'Переработка',
    
    // Forum
    discussions: 'Обсуждения',
    createTopic: 'Создать тему',
    search: 'Поиск',
    topicTitle: 'Название темы',
    category: 'Категория',
    replies: 'Ответы',
    views: 'Просмотры',
    latestReply: 'Последний ответ',
    topicContent: 'Содержание темы',
  },
  en: {
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    confirmPassword: 'Confirm Password',
    submitLogin: 'Sign In',
    submitRegister: 'Sign Up',
    noAccount: 'Don\'t have an account?',
    haveAccount: 'Already have an account?',
    
    // Navigation
    news: 'News Feed',
    profile: 'Profile',
    ecoCompare: 'Eco Compare',
    forum: 'Forum',
    
    // News Feed
    createPost: 'Create Post',
    whatThinking: 'What are you thinking?',
    postTitle: 'Title',
    postContent: 'Content',
    publish: 'Publish',
    like: 'Like',
    comment: 'Comment',
    share: 'Share',
    comments: 'Comments',
    viewComments: 'View Comments',
    writeComment: 'Write a comment...',
    
    // Profile
    editProfile: 'Edit Profile',
    bio: 'Bio',
    friends: 'Friends',
    posts: 'Posts',
    likes: 'Likes',
    lastSeen: 'Last Seen',
    settings: 'Settings',
    logout: 'Logout',
    language: 'Language',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    
    // Eco Compare
    compareTitle: 'Compare Eco-Friendliness',
    searchProduct: 'Search Product',
    category: 'Category',
    compare: 'Compare',
    ecoRating: 'Eco Rating',
    carbonFootprint: 'Carbon Footprint',
    materials: 'Materials',
    recycling: 'Recyclability',
    
    // Forum
    discussions: 'Discussions',
    createTopic: 'Create Topic',
    search: 'Search',
    topicTitle: 'Topic Title',
    category: 'Category',
    replies: 'Replies',
    views: 'Views',
    latestReply: 'Latest Reply',
    topicContent: 'Topic Content',
  }
};

type Language = 'ru' | 'en';
type TranslationKey = keyof typeof translations.en;

type LanguageContextType = {
  language: Language;
  t: (key: TranslationKey) => string;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>(user?.language || 'ru');

  useEffect(() => {
    // Update language when user preference changes
    if (user) {
      setLanguageState(user.language);
    }
  }, [user]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
