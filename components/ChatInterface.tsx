import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { startChatSession, sendMessageToAI } from '../services/geminiService';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  topic: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ topic }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello! I'm your AI Tutor for **${topic}**. Ask me to explain concepts, quiz you, or summarize tricky parts!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize session when topic changes
    startChatSession(topic);
    setMessages([{
      id: `welcome-${topic}`,
      role: 'model',
      content: `Hello! I'm your AI Tutor for **${topic}**. Ask me to explain concepts, quiz you, or summarize tricky parts!`,
      timestamp: new Date()
    }]);
  }, [topic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await sendMessageToAI(userMsg.content);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: aiResponseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Sparkles size={18} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">AI Tutor</h3>
            <p className="text-xs text-slate-500">Focus: {topic}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-indigo-600'}`}>
              {msg.role === 'user' ? <User size={14} className="text-slate-600" /> : <Bot size={14} className="text-white" />}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-white text-slate-800 rounded-tr-none' 
                  : 'bg-indigo-600 text-white rounded-tl-none'
              }`}
            >
             {msg.content.split('\n').map((line, i) => (
                <p key={i} className="mb-1 last:mb-0">{line}</p>
             ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
               <Bot size={14} className="text-white" />
             </div>
             <div className="bg-indigo-600/10 p-3 rounded-2xl rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
