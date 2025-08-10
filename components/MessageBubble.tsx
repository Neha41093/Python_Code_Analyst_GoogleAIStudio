
import React from 'react';
import type { ChatMessage } from '../types';
import { BotIcon, UserIcon } from './icons';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0 bg-slate-200 rounded-full flex items-center justify-center">
          <BotIcon className="w-5 h-5 text-blue-600" />
        </div>
      )}
      <div
        className={`max-w-xl p-4 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-lg'
            : 'bg-slate-200 text-slate-800 rounded-bl-lg'
        }`}
      >
        <p className="text-base whitespace-pre-wrap">{message.text}</p>
      </div>
       {isUser && (
        <div className="w-8 h-8 flex-shrink-0 bg-blue-600 rounded-full flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};