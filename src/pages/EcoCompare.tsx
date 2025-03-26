
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Search, Leaf, Car, Home, Laptop, ShoppingBag } from 'lucide-react';

// Mock data for eco products comparison
const ecoProducts = {
  cars: [
    {
      name: 'Tesla Model 3',
      type: 'Электрический',
      ecoRating: 90,
      carbonFootprint: 'Низкий',
      materials: 'Перерабатываемые материалы',
      recycling: 'Высокая степень переработки',
      image: '',
      pros: ['Нулевые выбросы', 'Экономия на топливе', 'Тихий ход'],
      cons: ['Высокая стоимость', 'Зависимость от зарядных станций']
    },
    {
      name: 'Toyota Prius',
      type: 'Гибрид',
      ecoRating: 75,
      carbonFootprint: 'Низкий к среднему',
      materials: 'Частично перерабатываемые',
      recycling: 'Средняя степень переработки',
      image: '',
      pros: ['Низкие выбросы', 'Экономичный расход топлива', 'Доступность'],
      cons: ['Не полностью электрический', 'Комплексная система']
    },
    {
      name: 'Volkswagen Golf',
      type: 'Дизель',
      ecoRating: 40,
      carbonFootprint: 'Высокий',
      materials: 'Стандартные материалы',
      recycling: 'Низкая степень переработки',
      image: '',
      pros: ['Доступность', 'Эффективность топлива на дальних расстояниях'],
      cons: ['Высокие выбросы', 'Загрязнение воздуха', 'Использование невозобновляемого топлива']
    }
  ],
  appliances: [
    {
      name: 'Samsung Eco Refrigerator',
      type: 'Холодильник',
      ecoRating: 85,
      carbonFootprint: 'Низкий',
      materials: 'Экологичные хладагенты',
      recycling: 'Высокая степень переработки',
      image: '',
      pros: ['Энергоэффективность', 'Отсутствие вредных веществ', 'Долговечность'],
      cons: ['Высокая стоимость', 'Ограниченная доступность']
    },
    {
      name: 'Standard Refrigerator',
      type: 'Холодильник',
      ecoRating: 45,
      carbonFootprint: 'Средний',
      materials: 'Стандартные хладагенты',
      recycling: 'Низкая степень переработки',
      image: '',
      pros: ['Доступность', 'Широкий выбор моделей'],
      cons: ['Высокое энергопотребление', 'Вредные вещества', 'Сложности с утилизацией']
    }
  ],
  electronics: [
    {
      name: 'Fairphone',
      type: 'Смартфон',
      ecoRating: 88,
      carbonFootprint: 'Низкий',
      materials: 'Устойчивые материалы, справедливая добыча минералов',
      recycling: 'Модульная конструкция для легкого ремонта',
      image: '',
      pros: ['Этичное производство', 'Долговечность', 'Ремонтопригодность'],
      cons: ['Ограниченная доступность', 'Средние технические характеристики']
    },
    {
      name: 'Standard Smartphone',
      type: 'Смартфон',
      ecoRating: 35,
      carbonFootprint: 'Высокий',
      materials: 'Стандартные материалы',
      recycling: 'Сложности с разборкой и утилизацией',
      image: '',
      pros: ['Широкая доступность', 'Высокие технические характеристики'],
      cons: ['Проблематичная цепочка поставок', 'Запланированное устаревание', 'Сложная утилизация']
    }
  ]
};

export const EcoCompare = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cars');
  const [compareResults, setCompareResults] = useState<typeof ecoProducts.cars>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    // Simulate search - in a real app would call API
    setHasSearched(true);
    
    if (searchQuery.trim().toLowerCase().includes('car') || searchQuery.trim().toLowerCase().includes('авто')) {
      setSelectedCategory('cars');
      setCompareResults(ecoProducts.cars);
    } else if (
      searchQuery.trim().toLowerCase().includes('phone') || 
      searchQuery.trim().toLowerCase().includes('телефон') ||
      searchQuery.trim().toLowerCase().includes('smartphone') ||
      searchQuery.trim().toLowerCase().includes('смартфон')
    ) {
      setSelectedCategory('electronics');
      setCompareResults(ecoProducts.electronics);
    } else if (
      searchQuery.trim().toLowerCase().includes('refrigerator') || 
      searchQuery.trim().toLowerCase().includes('холодильник')
    ) {
      setSelectedCategory('appliances');
      setCompareResults(ecoProducts.appliances);
    } else if (searchQuery.trim() === '') {
      // If empty search, show selected category
      setCompareResults(ecoProducts[selectedCategory as keyof typeof ecoProducts]);
    } else {
      // No matches
      setCompareResults([]);
    }
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCompareResults(ecoProducts[category as keyof typeof ecoProducts]);
    setHasSearched(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cars':
        return <Car className="h-5 w-5" />;
      case 'appliances':
        return <Home className="h-5 w-5" />;
      case 'electronics':
        return <Laptop className="h-5 w-5" />;
      default:
        return <ShoppingBag className="h-5 w-5" />;
    }
  };

  return (
    <AppLayout title={t('ecoCompare')}>
      <div className="space-y-6 py-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t('compareTitle')}</CardTitle>
            <CardDescription>
              {language === 'ru' 
                ? 'Сравните экологичность различных продуктов и сделайте осознанный выбор'
                : 'Compare the eco-friendliness of various products and make an informed choice'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('searchProduct')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                </div>
                <Button onClick={handleSearch}>{t('compare')}</Button>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto py-2">
                <Button
                  variant={selectedCategory === 'cars' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange('cars')}
                  className="flex items-center"
                >
                  <Car className="h-4 w-4 mr-2" />
                  {language === 'ru' ? 'Автомобили' : 'Cars'}
                </Button>
                <Button
                  variant={selectedCategory === 'appliances' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange('appliances')}
                  className="flex items-center whitespace-nowrap"
                >
                  <Home className="h-4 w-4 mr-2" />
                  {language === 'ru' ? 'Бытовая техника' : 'Appliances'}
                </Button>
                <Button
                  variant={selectedCategory === 'electronics' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange('electronics')}
                  className="flex items-center"
                >
                  <Laptop className="h-4 w-4 mr-2" />
                  {language === 'ru' ? 'Электроника' : 'Electronics'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {hasSearched && (
          <div className="space-y-4">
            {compareResults.length > 0 ? (
              compareResults.map((product, index) => (
                <Card key={index} className="glass-card overflow-hidden scale-transition">
                  <CardHeader className={`${product.ecoRating >= 70 ? 'bg-green-50 dark:bg-green-900/20' : product.ecoRating >= 50 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>{product.type}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.floor(product.ecoRating / 20) }).map((_, i) => (
                          <Leaf key={i} className="h-5 w-5 text-primary fill-primary" />
                        ))}
                        {product.ecoRating % 20 >= 10 && <Leaf className="h-5 w-5 text-primary" />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="overview">{language === 'ru' ? 'Обзор' : 'Overview'}</TabsTrigger>
                        <TabsTrigger value="details">{language === 'ru' ? 'Детали' : 'Details'}</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{t('ecoRating')}</span>
                            <span className="text-sm font-medium">{product.ecoRating}%</span>
                          </div>
                          <Progress value={product.ecoRating} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-sm">{t('carbonFootprint')}</span>
                          <div className="p-2 bg-secondary rounded text-sm">
                            {product.carbonFootprint}
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-2">{language === 'ru' ? 'Плюсы' : 'Pros'}</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {product.pros.map((pro, i) => (
                              <li key={i}>{pro}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">{language === 'ru' ? 'Минусы' : 'Cons'}</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                            {product.cons.map((con, i) => (
                              <li key={i}>{con}</li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="details" className="space-y-4 mt-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">{t('materials')}</h4>
                          <p className="text-sm">{product.materials}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">{t('recycling')}</h4>
                          <p className="text-sm">{product.recycling}</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <Search className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">
                        {language === 'ru' ? 'Ничего не найдено' : 'No results found'}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'ru' 
                          ? 'Попробуйте другой поисковый запрос или категорию' 
                          : 'Try a different search term or category'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};
