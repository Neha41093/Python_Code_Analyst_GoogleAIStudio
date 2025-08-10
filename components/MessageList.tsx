
import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-grow p-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
       {isLoading && messages[messages.length - 1]?.sender === 'user' && (
        <div className="flex items-start gap-3 my-4 justify-start">
          <div className="w-8 h-8 flex-shrink-0 bg-slate-200 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <div className="max-w-xl p-4 rounded-2xl text-white bg-slate-200 rounded-bl-lg">
            <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};