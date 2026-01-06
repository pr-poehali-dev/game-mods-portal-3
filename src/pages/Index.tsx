import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/AuthDialog';
import ModUploadDialog from '@/components/ModUploadDialog';
import ModerationPanel from '@/components/ModerationPanel';
import Header from '@/components/Header';
import SearchFilters from '@/components/SearchFilters';
import ModCatalog from '@/components/ModCatalog';
import ModDetail from '@/components/ModDetail';

const MODS_DATA = [
  {
    id: 1,
    title: 'Ultra HD Texture Pack',
    game: 'The Elder Scrolls V: Skyrim',
    category: 'Графика',
    author: 'ModMaster',
    authorAvatar: 'MM',
    downloads: 245000,
    rating: 4.9,
    reviews: 1523,
    version: '3.2.1',
    image: '🎨',
    requirements: 'GPU 4GB+, RAM 16GB',
    description: 'Полностью переработанные текстуры высокого разрешения для всех объектов в игре.',
  },
  {
    id: 2,
    title: 'Realistic Weapons Overhaul',
    game: 'Fallout 4',
    category: 'Оружие',
    author: 'GunSmith',
    authorAvatar: 'GS',
    downloads: 187000,
    rating: 4.7,
    reviews: 892,
    version: '2.0.5',
    image: '🔫',
    requirements: 'Base Game + DLC',
    description: 'Реалистичная балансировка оружия с новыми моделями и звуками.',
  },
  {
    id: 3,
    title: 'Advanced Quest System',
    game: 'The Witcher 3',
    category: 'Квесты',
    author: 'QuestLord',
    authorAvatar: 'QL',
    downloads: 156000,
    rating: 4.8,
    reviews: 743,
    version: '1.8.2',
    image: '📜',
    requirements: 'Wild Hunt + Hearts of Stone',
    description: 'Более 50 новых квестов с уникальными сюжетными линиями и наградами.',
  },
  {
    id: 4,
    title: 'Performance Boost+',
    game: 'Grand Theft Auto V',
    category: 'Геймплей',
    author: 'SpeedDemon',
    authorAvatar: 'SD',
    downloads: 423000,
    rating: 4.6,
    reviews: 2134,
    version: '4.1.0',
    image: '⚡',
    requirements: 'GTA V 1.50+',
    description: 'Оптимизация производительности без потери качества графики.',
  },
  {
    id: 5,
    title: 'Character Enhancement Suite',
    game: 'Minecraft',
    category: 'Персонажи',
    author: 'SkinArtist',
    authorAvatar: 'SA',
    downloads: 312000,
    rating: 4.9,
    reviews: 1876,
    version: '2.5.3',
    image: '👤',
    requirements: 'Minecraft 1.19+',
    description: 'Расширенная кастомизация персонажа с новыми анимациями.',
  },
  {
    id: 6,
    title: 'Lighting Overhaul',
    game: 'The Elder Scrolls V: Skyrim',
    category: 'Графика',
    author: 'LightMage',
    authorAvatar: 'LM',
    downloads: 198000,
    rating: 4.8,
    reviews: 1245,
    version: '3.0.1',
    image: '💡',
    requirements: 'SKSE64 Required',
    description: 'Кинематографичное освещение для атмосферного геймплея.',
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('Все игры');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedMod, setSelectedMod] = useState<number | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [showModeration, setShowModeration] = useState(false);
  const [mods, setMods] = useState(MODS_DATA);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadMods();
  }, []);

  const loadMods = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f9e63e9b-bb97-4767-a24a-04f5e3fbbc6f?status=approved');
      const data = await response.json();
      if (data.mods && data.mods.length > 0) {
        setMods(data.mods.map((mod: any) => ({
          id: mod.id,
          title: mod.title,
          game: mod.game,
          category: mod.category,
          author: mod.author_name || 'Аноним',
          authorAvatar: mod.author_name ? mod.author_name.substring(0, 2).toUpperCase() : 'AN',
          downloads: mod.downloads || 0,
          rating: mod.rating || 0,
          reviews: mod.review_count || 0,
          version: mod.version,
          image: mod.image_emoji || '📦',
          requirements: mod.requirements || 'Нет требований',
          description: mod.description,
        })));
      }
    } catch (error) {
      console.error('Failed to load mods:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMods = mods.filter((mod) => {
    const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'Все игры' || mod.game === selectedGame;
    const matchesCategory = selectedCategory === 'Все' || mod.category === selectedCategory;
    return matchesSearch && matchesGame && matchesCategory;
  });

  const getRecommendations = (currentMod: typeof mods[0]) => {
    return mods.filter(
      (mod) =>
        mod.id !== currentMod.id &&
        (mod.game === currentMod.game || mod.category === currentMod.category)
    ).slice(0, 3);
  };

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
    } else {
      setUploadDialogOpen(true);
    }
  };

  const currentMod = mods.find((mod) => mod.id === selectedMod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <Header
        onAuthClick={() => setAuthDialogOpen(true)}
        onUploadClick={handleUploadClick}
        onModerationClick={setShowModeration}
      />

      <main className="container mx-auto px-4 py-12">
        {showModeration ? (
          <ModerationPanel />
        ) : selectedMod === null ? (
          <>
            <SearchFilters
              searchQuery={searchQuery}
              selectedGame={selectedGame}
              selectedCategory={selectedCategory}
              onSearchChange={setSearchQuery}
              onGameChange={setSelectedGame}
              onCategoryChange={setSelectedCategory}
            />
            <ModCatalog mods={filteredMods} onModClick={setSelectedMod} />
          </>
        ) : currentMod ? (
          <ModDetail
            mod={currentMod}
            recommendations={getRecommendations(currentMod)}
            onBack={() => setSelectedMod(null)}
            onModClick={setSelectedMod}
          />
        ) : null}

        <section className="mt-24 text-center">
          <Card className="max-w-2xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="text-2xl">Свяжись с нами</CardTitle>
              <CardDescription>Есть вопросы или предложения? Мы всегда рады помочь!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Icon name="Mail" size={18} />
                  <span>support@modhub.ru</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Icon name="MessageCircle" size={18} />
                  <span>Telegram: @modhub_support</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" size="lg">
                <Icon name="Send" size={18} className="mr-2" />
                Написать нам
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>

      <footer className="border-t mt-24 py-8 bg-secondary/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 ModHub. Платформа для публикации модификаций к играм.</p>
        </div>
      </footer>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <ModUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} onSuccess={loadMods} />
    </div>
  );
}
