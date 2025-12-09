import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

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

interface ChatSectionProps {
  messages: Message[];
  input: string;
  isSearching: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

const ChatSection = ({ messages, input, isSearching, onInputChange, onSend }: ChatSectionProps) => {
  return (
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
                <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>

                {message.searchResults && message.searchResults.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Источники:
                    </p>
                    {message.searchResults.map((result, idx) => (
                      result.url && (
                        <a
                          key={idx}
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                        >
                          <Icon name="ExternalLink" size={14} className="mt-0.5 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-1">
                              {result.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {result.url}
                            </p>
                          </div>
                        </a>
                      )
                    ))}
                  </div>
                )}

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
        <div className="max-w-4xl mx-auto">
          {isSearching && (
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <Icon name="Globe" size={16} className="animate-spin" />
              <span>Ищу информацию в интернете...</span>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isSearching && onSend()}
              placeholder="Напишите сообщение..."
              className="flex-1"
              disabled={isSearching}
            />
            <Button onClick={onSend} className="gradient-bg" disabled={isSearching}>
              <Icon name={isSearching ? 'Loader2' : 'Send'} size={18} className={isSearching ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
