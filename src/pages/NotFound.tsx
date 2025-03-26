
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center animate-fadeIn">
        <div className="mb-6 text-9xl font-extrabold text-primary">404</div>
        <h1 className="text-3xl font-bold mb-4">
          {language === 'ru' ? 'Страница не найдена' : 'Page Not Found'}
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          {language === 'ru' 
            ? 'Извините, страница, которую вы ищете, не существует или была перемещена.' 
            : 'Sorry, the page you are looking for doesn\'t exist or has been moved.'}
        </p>
        <Button asChild className="animate-scaleIn">
          <Link to="/">
            {language === 'ru' ? 'Вернуться на главную' : 'Back to Home'}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
