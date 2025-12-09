import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я RotyChat AI. Чем могу помочь сегодня?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [activeSection, setActiveSection] = useState('chat');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Это демо-ответ AI. Подключите внешний API для полноценной работы!',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, aiResponse]);
    setInput('');
  };

  const sidebarItems = [
    { id: 'chat', label: 'Чат', icon: 'MessageSquare' },
    { id: 'history', label: 'История', icon: 'Clock' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
    { id: 'pricing', label: 'Тарифы', icon: 'CreditCard' },
    { id: 'docs', label: 'Документация', icon: 'BookOpen' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
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
                onClick={() => setActiveSection(item.id)}
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

      <main className="flex-1 flex flex-col">
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
                        onClick={() => setActiveSection(item.id)}
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
            <Badge variant="secondary" className="hidden sm:flex">
              <Icon name="Zap" size={14} className="mr-1" />
              Быстрый режим
            </Badge>
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
          </div>
        </header>

        {activeSection === 'chat' && (
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 animate-fade-in ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="gradient-bg text-white">
                          <Icon name="Bot" size={20} />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <Card
                      className={`max-w-[80%] p-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-primary to-secondary text-white'
                          : 'bg-card'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </Card>
                    {message.role === 'user' && (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-muted">П</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border p-4 bg-background">
              <div className="max-w-4xl mx-auto flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Напишите сообщение..."
                  className="flex-1"
                />
                <Button onClick={handleSend} className="gradient-bg">
                  <Icon name="Send" size={18} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'history' && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">История диалогов</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Диалог {i}</h4>
                        <p className="text-sm text-muted-foreground">
                          Последнее сообщение: Это демо-ответ AI...
                        </p>
                      </div>
                      <Badge variant="outline">Сегодня</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">Настройки</h3>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">Общие</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                  <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-6">
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Быстрый режим</Label>
                          <p className="text-sm text-muted-foreground">
                            Ускоренная обработка запросов
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Уведомления</Label>
                          <p className="text-sm text-muted-foreground">
                            Получать уведомления о новых сообщениях
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="api" className="space-y-4 mt-6">
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4">Подключение внешних API</h4>
                    <div className="space-y-3">
                      <div>
                        <Label>OpenAI API Key</Label>
                        <Input placeholder="sk-..." className="mt-2" />
                      </div>
                      <div>
                        <Label>Webhook URL</Label>
                        <Input placeholder="https://..." className="mt-2" />
                      </div>
                      <Button className="gradient-bg mt-4">Сохранить</Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4 mt-6">
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Тёмная тема</Label>
                          <p className="text-sm text-muted-foreground">
                            Использовать тёмное оформление
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {activeSection === 'pricing' && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-2 text-center">Тарифы</h3>
              <p className="text-center text-muted-foreground mb-8">
                Выберите подходящий план для ваших задач
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: 'Free', price: '0', features: ['10 сообщений/день', 'Базовая модель'] },
                  {
                    name: 'Pro',
                    price: '990',
                    features: ['Безлимит', 'Все модели', 'API доступ'],
                  },
                  {
                    name: 'Team',
                    price: '2990',
                    features: ['Всё из Pro', 'Командная работа', 'Приоритет'],
                  },
                ].map((plan) => (
                  <Card
                    key={plan.name}
                    className={`p-6 ${
                      plan.name === 'Pro' ? 'border-primary shadow-lg scale-105' : ''
                    }`}
                  >
                    <h4 className="font-bold text-xl mb-2">{plan.name}</h4>
                    <p className="text-3xl font-bold mb-4">
                      {plan.price} ₽<span className="text-sm text-muted-foreground">/мес</span>
                    </p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Icon name="Check" size={16} className="text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={plan.name === 'Pro' ? 'gradient-bg w-full' : 'w-full'}
                      variant={plan.name === 'Pro' ? 'default' : 'outline'}
                    >
                      Выбрать
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'docs' && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">Документация</h3>
              <div className="space-y-6">
                <Card className="p-6">
                  <h4 className="font-bold text-lg mb-3">Начало работы</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    RotyChat AI — это платформа для общения с искусственным интеллектом. Просто
                    задавайте вопросы в чате и получайте развёрнутые ответы.
                  </p>
                </Card>
                <Card className="p-6">
                  <h4 className="font-bold text-lg mb-3">Подключение API</h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Для расширения функционала вы можете подключить внешние сервисы через раздел
                    Настройки → API. Поддерживаются OpenAI, Anthropic и другие провайдеры.
                  </p>
                  <code className="block bg-muted p-4 rounded text-sm">
                    POST /api/connect <br />
                    {"{ \"provider\": \"openai\", \"key\": \"sk-...\" }"}
                  </code>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">Профиль</h3>
              <Card className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="gradient-bg text-white text-3xl">П</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div>
                      <Label>Имя пользователя</Label>
                      <Input defaultValue="Пользователь" className="mt-2" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input defaultValue="user@example.com" className="mt-2" type="email" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>Free Plan</Badge>
                      <Button variant="link" className="p-0">
                        Улучшить план
                      </Button>
                    </div>
                    <Button className="gradient-bg">Сохранить изменения</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
