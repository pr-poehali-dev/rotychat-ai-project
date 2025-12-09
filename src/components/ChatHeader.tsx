import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

interface ChatHeaderProps {
  sidebarItems: SidebarItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const ChatHeader = ({
  sidebarItems,
  activeSection,
  onSectionChange,
  isDarkMode,
  onToggleDarkMode,
}: ChatHeaderProps) => {
  return (
    <header className="h-16 border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Icon name="Menu" size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-left">
                <span className="gradient-text">RotyChat AI</span>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-100px)] p-4">
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
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
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <h2 className="text-lg font-semibold hidden sm:block">
          {sidebarItems.find((item) => item.id === activeSection)?.label}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
          <Icon name="Globe" size={14} />
          <Icon name="Calculator" size={14} />
          <span className="ml-1">AI + Интернет</span>
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleDarkMode}
          className="relative"
        >
          {isDarkMode ? (
            <Icon name="Sun" size={20} className="text-yellow-500" />
          ) : (
            <Icon name="Moon" size={20} />
          )}
        </Button>
        <Button variant="ghost" size="icon">
          <Icon name="Bell" size={20} />
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
