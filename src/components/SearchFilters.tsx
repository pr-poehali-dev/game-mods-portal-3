import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

interface SearchFiltersProps {
  searchQuery: string;
  selectedGame: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onGameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export default function SearchFilters({
  searchQuery,
  selectedGame,
  selectedCategory,
  onSearchChange,
  onGameChange,
  onCategoryChange,
}: SearchFiltersProps) {
  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        <Select value={selectedGame} onValueChange={onGameChange}>
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
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </section>
  );
}
