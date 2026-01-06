import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

interface ModCatalogProps {
  mods: Mod[];
  onModClick: (modId: number) => void;
}

export default function ModCatalog({ mods, onModClick }: ModCatalogProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
      {mods.map((mod) => (
        <Card
          key={mod.id}
          className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 overflow-hidden"
          onClick={() => onModClick(mod.id)}
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
  );
}
