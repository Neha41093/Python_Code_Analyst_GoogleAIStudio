
import React from 'react';
import type { AnalysisResult, ChatMessage } from '../types';
import { MetricsDisplay } from './MetricsDisplay';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

interface ChatPanelProps {
  analysisResult: AnalysisResult | null;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean; // For chat responses
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ analysisResult, chatHistory, onSendMessage, isLoading }) => {
  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
      {analysisResult ? (
        <>
          <div className="p-6 border-b border-slate-200">
             <h2 className="text-xl font-bold tracking-tight text-slate-800 mb-2">{analysisResult.summary}</h2>
             <p className="text-sm text-slate-500 mb-4">{analysisResult.overview}</p>
             <MetricsDisplay metrics={analysisResult.metrics} />
          </div>
          <MessageList messages={chatHistory} isLoading={isLoading} />
          <ChatInput onSend={onSendMessage} isLoading={isLoading} disabled={false} />
        </>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-600">Awaiting Analysis</h2>
            <p className="text-slate-500 mt-2 max-w-sm">
                Paste your Python code into the panel on the left and click 'Analyze Code' to get started.
            </p>
        </div>
      )}
    </div>
  );
};