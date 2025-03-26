
import { useLanguage } from '@/contexts/LanguageContext';
import { Leaf } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
}

export const AppHeader = ({ title }: AppHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-black/50 border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div className="container flex h-16 items-center">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">
              {title || 'ЭкоМир'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
