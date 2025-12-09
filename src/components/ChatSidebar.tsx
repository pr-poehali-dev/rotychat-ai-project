import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

interface ChatSidebarProps {
  sidebarItems: SidebarItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ChatSidebar = ({ sidebarItems, activeSection, onSectionChange }: ChatSidebarProps) => {
  return (
    <aside className="hidden lg:flex w-72 border-r border-border bg-sidebar flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold gradient-text">RotyChat AI</h1>
        <p className="text-sm text-muted-foreground mt-1">Умный ассистент для всех задач</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-sidebar-accent ${
                activeSection === item.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground'
              }`}
            >
              <Icon name={item.icon as any} size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Sparkles" size={16} className="text-primary" />
            <h3 className="font-semibold text-sm">Подключить API</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Расширьте возможности через внешние сервисы
          </p>
          <Button size="sm" className="w-full gradient-bg">
            Настроить
          </Button>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="gradient-bg text-white">П</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">Пользователь</p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
          <Button variant="ghost" size="icon">
            <Icon name="MoreVertical" size={18} />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
