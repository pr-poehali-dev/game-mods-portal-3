import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Mod {
  id: number;
  title: string;
  game: string;
  category: string;
  author_name: string;
  description: string;
  version: string;
  requirements: string;
  image_emoji: string;
  status: string;
  created_at: string;
}

export default function ModerationPanel() {
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState<{ [key: number]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadPendingMods();
  }, []);

  const loadPendingMods = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await fetch(
        'https://functions.poehali.dev/f9e63e9b-bb97-4767-a24a-04f5e3fbbc6f?status=pending',
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setMods(data.mods || []);
    } catch (error) {
      console.error('Failed to load mods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (modId: number, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await fetch('https://functions.poehali.dev/f9e63e9b-bb97-4767-a24a-04f5e3fbbc6f', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          mod_id: modId,
          status,
          rejection_reason: status === 'rejected' ? rejectionReason[modId] : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Модерация не удалась');
      }

      toast({
        title: status === 'approved' ? 'Мод одобрен' : 'Мод отклонён',
        description: 'Статус мода обновлён',
      });

      loadPendingMods();
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (mods.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-semibold mb-2">Нет модов на модерации</p>
          <p className="text-muted-foreground">Все моды проверены!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Панель модерации</h2>
        <Badge variant="secondary">{mods.length} модов на проверке</Badge>
      </div>

      {mods.map((mod) => (
        <Card key={mod.id} className="border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                  {mod.image_emoji}
                </div>
                <div>
                  <CardTitle className="text-xl mb-1">{mod.title}</CardTitle>
                  <CardDescription>
                    {mod.game} • {mod.category} • v{mod.version}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-1">
                    Автор: {mod.author_name} • {new Date(mod.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <Badge>На модерации</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Описание:</h4>
              <p className="text-muted-foreground">{mod.description}</p>
            </div>

            {mod.requirements && (
              <div>
                <h4 className="font-semibold mb-2">Требования:</h4>
                <p className="text-muted-foreground">{mod.requirements}</p>
              </div>
            )}

            <div className="space-y-3 pt-4 border-t">
              <Textarea
                placeholder="Причина отклонения (опционально)"
                value={rejectionReason[mod.id] || ''}
                onChange={(e) => setRejectionReason({ ...rejectionReason, [mod.id]: e.target.value })}
                rows={2}
              />
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  onClick={() => handleModerate(mod.id, 'rejected')}
                  className="flex-1"
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Отклонить
                </Button>
                <Button onClick={() => handleModerate(mod.id, 'approved')} className="flex-1">
                  <Icon name="Check" size={16} className="mr-2" />
                  Одобрить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
