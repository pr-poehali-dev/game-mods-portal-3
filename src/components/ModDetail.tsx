import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Mod {
  id: number;
  title: string;
  game: string;
  category: string;
  author: string;
  authorAvatar: string;
  downloads: number;
  rating: number;
  reviews: number;
  version: string;
  image: string;
  requirements: string;
  description: string;
}

interface ModDetailProps {
  mod: Mod;
  recommendations: Mod[];
  onBack: () => void;
  onModClick: (modId: number) => void;
}

export default function ModDetail({ mod, recommendations, onBack, onModClick }: ModDetailProps) {
  return (
    <section className="max-w-5xl mx-auto animate-fade-in">
      <Button variant="ghost" className="mb-6" onClick={onBack}>
        <Icon name="ArrowLeft" size={16} className="mr-2" />
        Вернуться к каталогу
      </Button>

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
                onClick={() => onModClick(recMod.id)}
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
    </section>
  );
}
