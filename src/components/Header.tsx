import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
  onUploadClick: () => void;
  onModerationClick: (show: boolean) => void;
}

export default function Header({ onAuthClick, onUploadClick, onModerationClick }: HeaderProps) {
  const { user, logout, isAuthenticated, isModerator } = useAuth();

  return (
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
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onModerationClick(false)}>
              Каталог
            </Button>
            {isModerator && (
              <Button variant="ghost" size="sm" onClick={() => onModerationClick(true)}>
                <Icon name="Shield" size={16} className="mr-2" />
                Модерация
              </Button>
            )}
            <Button size="sm" onClick={onUploadClick} className="bg-gradient-to-r from-primary to-accent">
              <Icon name="Upload" size={16} className="mr-2" />
              Загрузить мод
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {user?.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {user?.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.username}</span>
                      <span className="text-xs text-muted-foreground font-normal">{user?.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={onAuthClick}>
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
