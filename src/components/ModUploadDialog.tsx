import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface ModUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const GAMES = ['Minecraft', 'The Elder Scrolls V: Skyrim', 'Grand Theft Auto V', 'Fallout 4', 'The Witcher 3'];
const CATEGORIES = ['Графика', 'Геймплей', 'Оружие', 'Квесты', 'Персонажи'];
const EMOJIS = ['🎨', '🔫', '📜', '⚡', '👤', '💡', '🛡️', '🗡️', '🏹', '🎮'];

export default function ModUploadDialog({ open, onOpenChange, onSuccess }: ModUploadDialogProps) {
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('');
  const [requirements, setRequirements] = useState('');
  const [emoji, setEmoji] = useState('📦');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('session_token');
      const response = await fetch('https://functions.poehali.dev/f9e63e9b-bb97-4767-a24a-04f5e3fbbc6f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          game,
          category,
          description,
          version,
          requirements,
          image_emoji: emoji,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка загрузки мода');
      }

      toast({
        title: 'Мод отправлен на модерацию',
        description: 'После проверки модератором мод появится в каталоге',
      });

      onOpenChange(false);
      onSuccess();
      resetForm();
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setGame('');
    setCategory('');
    setDescription('');
    setVersion('');
    setRequirements('');
    setEmoji('📦');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Загрузить новый мод</DialogTitle>
          <DialogDescription>Заполните информацию о вашем моде. После проверки он появится в каталоге.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Название мода *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Например: Ultra HD Texture Pack"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="game">Игра *</Label>
              <Select value={game} onValueChange={setGame} required>
                <SelectTrigger id="game">
                  <SelectValue placeholder="Выберите игру" />
                </SelectTrigger>
                <SelectContent>
                  {GAMES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Категория *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="version">Версия *</Label>
              <Input
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                required
                placeholder="1.0.0"
              />
            </div>

            <div>
              <Label htmlFor="emoji">Иконка</Label>
              <Select value={emoji} onValueChange={setEmoji}>
                <SelectTrigger id="emoji">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMOJIS.map((em) => (
                    <SelectItem key={em} value={em}>
                      {em}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Описание *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Подробное описание мода и его возможностей"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="requirements">Системные требования</Label>
            <Input
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Например: GPU 4GB+, RAM 16GB"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Icon name="Upload" size={16} className="mr-2" />
                  Загрузить мод
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
