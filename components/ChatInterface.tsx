import React, { useState, useEffect, useRef } from 'react';
import { PERSONAS } from '../constants';
import { Persona, ChatMessage } from '../types';
import { createChatSession, sendMessageToChat } from '../services/geminiService';
import { Chat } from '@google/genai';

const ChatInterface: React.FC = () => {
  const [activePersona, setActivePersona] = useState<Persona>(PERSONAS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize chat when persona changes
  useEffect(() => {
    const initChat = async () => {
      setMessages([{
        id: 'init',
        role: 'model',
        text: `I am ${activePersona.name}, ${activePersona.role}. Ask me anything about our times.`,
        timestamp: new Date()
      }]);
      const session = await createChatSession(activePersona.systemPrompt);
      setChatSession(session);
    };
    initChat();
  }, [activePersona]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToChat(chatSession, userMsg.text);
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg border border-gray-700 shadow-xl overflow-hidden">
      {/* Persona Selector */}
      <div className="bg-gray-900 p-4 border-b border-gray-700">
        <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Choose your guide</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {PERSONAS.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePersona(p)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
                activePersona.id === p.id 
                  ? 'bg-amber-900/50 border-amber-500 text-amber-100' 
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
              <span className="text-xs font-semibold whitespace-nowrap">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-amber-700 text-white rounded-tr-none' 
                : 'bg-gray-700 text-gray-200 rounded-tl-none border border-gray-600'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-lg p-3 rounded-tl-none border border-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${activePersona.name}...`}
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;