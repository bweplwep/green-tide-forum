
import { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { BottomNavigation } from './BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  className?: string;
  showNav?: boolean;
}

export const AppLayout = ({
  children,
  title,
  className,
  showNav = true,
}: AppLayoutProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title={title} />
      <main
        className={cn(
          "flex-1 container transition-all duration-300 animate-fadeIn",
          isAuthenticated && showNav ? "pb-20" : "",
          className
        )}
      >
        {children}
      </main>
      {isAuthenticated && showNav && <BottomNavigation />}
    </div>
  );
};
