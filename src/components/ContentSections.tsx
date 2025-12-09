import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface ContentSectionsProps {
  activeSection: string;
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

const ContentSections = ({ activeSection, isDarkMode, onToggleDarkMode }: ContentSectionsProps) => {
  if (activeSection === 'chat') return null;

  return (
    <>
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
                      <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
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
    </>
  );
};

export default ContentSections;
