import { useState, useEffect } from 'react';
import ChatSidebar from '@/components/ChatSidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatSection from '@/components/ChatSection';
import ContentSections from '@/components/ContentSections';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  searchResults?: SearchResult[];
}

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я RotyChat AI с доступом в интернет и умею решать математику! Задайте вопрос или математический пример.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [activeSection, setActiveSection] = useState('chat');
  const [isSearching, setIsSearching] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const detectQueryType = (query: string): 'math' | 'search' => {
    const mathPatterns = [
      /\d+\s*[\+\-\*\/×÷]\s*\d+/,
      /(?:сколько|вычисл|реш|посчита)/i,
      /\d+\s*процент/i,
      /корень|факториал|степен/i,
      /^\s*[\d\s\+\-\*\/\(\)\.]+\s*$/,
    ];
    
    return mathPatterns.some(pattern => pattern.test(query)) ? 'math' : 'search';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    const currentInput = input;
    setInput('');
    setIsSearching(true);

    const queryType = detectQueryType(currentInput);

    try {
      if (queryType === 'math') {
        const response = await fetch('https://functions.poehali.dev/e8679176-d21e-4aba-99ff-03f11914ba15', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ expression: currentInput }),
        });

        const data = await response.json();

        let aiContent = '';
        if (data.result !== undefined) {
          aiContent = `${data.explanation}\n\n📊 Ответ: ${data.result}`;
          if (data.steps && data.steps.length > 0) {
            aiContent += `\n\nШаги решения:\n${data.steps.join('\n')}`;
          }
        } else {
          aiContent = data.error || 'Не удалось вычислить выражение';
        }

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiContent,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiResponse]);
      } else {
        const response = await fetch('https://functions.poehali.dev/2d002e5d-640c-49a2-a187-b49d462956d4', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: currentInput }),
        });

        const data = await response.json();

        let aiContent = '';
        const searchResults: SearchResult[] = [];

        if (data.results && data.results.length > 0) {
          const mainResult = data.results[0];
          
          if (mainResult.snippet && mainResult.snippet !== 'К сожалению, по запросу') {
            aiContent = `По вашему запросу "${currentInput}" я нашёл следующую информацию:\n\n${mainResult.snippet}`;
            
            data.results.forEach((result: SearchResult) => {
              if (result.url) {
                searchResults.push(result);
              }
            });
          } else {
            aiContent = `К сожалению, по запросу "${currentInput}" я не нашёл конкретной информации. Попробуйте переформулировать вопрос.`;
          }
        } else {
          aiContent = 'Не удалось найти информацию. Попробуйте другой запрос.';
        }

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiContent,
          timestamp: new Date(),
          searchResults: searchResults.length > 0 ? searchResults : undefined,
        };

        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте снова.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsSearching(false);
    }
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
      <ChatSidebar
        sidebarItems={sidebarItems}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="flex-1 flex flex-col">
        <ChatHeader
          sidebarItems={sidebarItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        {activeSection === 'chat' && (
          <ChatSection
            messages={messages}
            input={input}
            isSearching={isSearching}
            onInputChange={setInput}
            onSend={handleSend}
          />
        )}

        <ContentSections
          activeSection={activeSection}
          isDarkMode={isDarkMode}
          onToggleDarkMode={setIsDarkMode}
        />
      </main>
    </div>
  );
};

export default Index;
