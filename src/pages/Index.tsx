import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const GAMES = [
  'Все игры',
  'Minecraft',
  'The Elder Scrolls V: Skyrim',
  'Grand Theft Auto V',
  'Fallout 4',
  'The Witcher 3',
];

const CATEGORIES = ['Все', 'Графика', 'Геймплей', 'Оружие', 'Квесты', 'Персонажи'];

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

  const filteredMods = MODS_DATA.filter((mod) => {
    const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'Все игры' || mod.game === selectedGame;
    const matchesCategory = selectedCategory === 'Все' || mod.category === selectedCategory;
    return matchesSearch && matchesGame && matchesCategory;
  });

  const getRecommendations = (currentMod: typeof MODS_DATA[0]) => {
    return MODS_DATA.filter(
      (mod) =>
        mod.id !== currentMod.id &&
        (mod.game === currentMod.game || mod.category === currentMod.category)
    ).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ModHub
                </h1>
                <p className="text-xs text-muted-foreground">Платформа модификаций</p>
              </div>
            </div>
            <nav className="flex gap-6">
              <Button variant="ghost" size="sm">
                Каталог
              </Button>
              <Button variant="ghost" size="sm">
                Разработчики
              </Button>
              <Button variant="ghost" size="sm">
                Контакты
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                <Icon name="Upload" size={16} className="mr-2" />
                Загрузить мод
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center animate-fade-in">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Найди идеальный мод
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Тысячи модификаций для твоих любимых игр. Умные рекомендации на основе твоих предпочтений.
          </p>

          <div className="flex gap-4 max-w-4xl mx-auto mb-8">
            <div className="flex-1 relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск модификаций..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-64 h-12">
                <SelectValue placeholder="Выберите игру" />
              </SelectTrigger>
              <SelectContent>
                {GAMES.map((game) => (
                  <SelectItem key={game} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </section>

        {selectedMod === null ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
            {filteredMods.map((mod) => (
              <Card
                key={mod.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 overflow-hidden"
                onClick={() => setSelectedMod(mod.id)}
              >
                <CardHeader className="relative pb-4">
                  <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <span className="text-7xl">{mod.image}</span>
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {mod.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Icon name="Gamepad2" size={14} />
                    {mod.game}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{mod.rating}</span>
                      <span className="text-muted-foreground text-sm">({mod.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="Download" size={16} />
                      <span className="text-sm">{(mod.downloads / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {mod.authorAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{mod.author}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    v{mod.version}
                  </Badge>
                </CardContent>
                <CardFooter>
                  <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all">
                    Подробнее
                    <Icon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </section>
        ) : (
          <section className="max-w-5xl mx-auto animate-fade-in">
            <Button variant="ghost" className="mb-6" onClick={() => setSelectedMod(null)}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Вернуться к каталогу
            </Button>

            {MODS_DATA.filter((mod) => mod.id === selectedMod).map((mod) => {
              const recommendations = getRecommendations(mod);
              return (
                <div key={mod.id}>
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-start gap-6">
                        <div className="w-48 h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-8xl">{mod.image}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <CardTitle className="text-3xl mb-2">{mod.title}</CardTitle>
                              <CardDescription className="text-base flex items-center gap-2">
                                <Icon name="Gamepad2" size={16} />
                                {mod.game}
                              </CardDescription>
                            </div>
                            <Badge className="text-base px-4 py-1">v{mod.version}</Badge>
                          </div>

                          <div className="flex items-center gap-6 mb-4">
                            <div className="flex items-center gap-2">
                              <Icon name="Star" size={20} className="fill-yellow-400 text-yellow-400" />
                              <span className="text-2xl font-bold">{mod.rating}</span>
                              <span className="text-muted-foreground">({mod.reviews} отзывов)</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Icon name="Download" size={20} />
                              <span className="font-semibold">{mod.downloads.toLocaleString()} скачиваний</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                                {mod.authorAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{mod.author}</p>
                              <p className="text-sm text-muted-foreground">Разработчик</p>
                            </div>
                          </div>

                          <Button size="lg" className="w-full bg-gradient-to-r from-primary to-accent">
                            <Icon name="Download" size={20} className="mr-2" />
                            Скачать мод
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="description" className="w-full">
                        <TabsList className="w-full justify-start">
                          <TabsTrigger value="description">Описание</TabsTrigger>
                          <TabsTrigger value="requirements">Требования</TabsTrigger>
                          <TabsTrigger value="reviews">Отзывы ({mod.reviews})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="py-6">
                          <p className="text-base leading-relaxed">{mod.description}</p>
                          <div className="mt-6 flex gap-2">
                            <Badge variant="secondary">{mod.category}</Badge>
                            <Badge variant="outline">Обновлён 2 дня назад</Badge>
                          </div>
                        </TabsContent>
                        <TabsContent value="requirements" className="py-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Icon name="HardDrive" size={18} />
                                Системные требования
                              </h4>
                              <p className="text-muted-foreground">{mod.requirements}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Icon name="Package" size={18} />
                                Размер файла
                              </h4>
                              <p className="text-muted-foreground">2.4 GB</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Icon name="Calendar" size={18} />
                                Последнее обновление
                              </h4>
                              <p className="text-muted-foreground">04 января 2026</p>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="reviews" className="py-6">
                          <div className="space-y-4">
                            {[
                              { user: 'GamerPro', rating: 5, text: 'Отличный мод! Полностью изменил игру к лучшему.' },
                              { user: 'ModFan', rating: 5, text: 'Работает без проблем, рекомендую!' },
                              { user: 'Player123', rating: 4, text: 'Хороший мод, но требует много ресурсов.' },
                            ].map((review, idx) => (
                              <Card key={idx}>
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarFallback>{review.user[0]}</AvatarFallback>
                                      </Avatar>
                                      <span className="font-semibold">{review.user}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {Array.from({ length: review.rating }).map((_, i) => (
                                        <Icon key={i} name="Star" size={14} className="fill-yellow-400 text-yellow-400" />
                                      ))}
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-muted-foreground">{review.text}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  {recommendations.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Icon name="Sparkles" size={24} className="text-primary" />
                        Похожие моды для тебя
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendations.map((recMod) => (
                          <Card
                            key={recMod.id}
                            className="hover:shadow-lg transition-all cursor-pointer border hover:border-primary/50"
                            onClick={() => setSelectedMod(recMod.id)}
                          >
                            <CardHeader>
                              <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center mb-3">
                                <span className="text-5xl">{recMod.image}</span>
                              </div>
                              <CardTitle className="text-lg">{recMod.title}</CardTitle>
                              <CardDescription className="text-sm">{recMod.game}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1">
                                  <Icon name="Star" size={14} className="fill-yellow-400 text-yellow-400" />
                                  <span>{recMod.rating}</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Icon name="Download" size={14} />
                                  <span>{(recMod.downloads / 1000).toFixed(0)}K</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

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
    </div>
  );
}