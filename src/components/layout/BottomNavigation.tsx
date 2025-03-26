
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Home, User, BarChart3, MessageSquare } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const BottomNavigation = () => {
  const { t } = useLanguage();

  const navItems = [
    {
      icon: Home,
      label: t('news'),
      to: '/feed',
    },
    {
      icon: BarChart3,
      label: t('ecoCompare'),
      to: '/eco-compare',
    },
    {
      icon: MessageSquare,
      label: t('forum'),
      to: '/forum',
    },
    {
      icon: User,
      label: t('profile'),
      to: '/profile',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 glass-card backdrop-blur-lg bg-white/70 dark:bg-black/50 z-50 transition-all duration-300">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center p-2 w-full h-full transition-all duration-300 ease-in-out",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn("h-5 w-5 mb-1 transition-transform", 
                    isActive ? "scale-110" : "scale-100")}
                />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute top-0 w-1/4 h-0.5 bg-primary animate-fadeIn" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
