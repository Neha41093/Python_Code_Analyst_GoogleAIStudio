import React, { useState, useCallback } from 'react';
import { CodeInputPanel } from './components/CodeInputPanel';
import { ChatPanel } from './components/ChatPanel';
import { analyzeCode, askQuestionStream } from './services/geminiService';
import type { AnalysisResult, ChatMessage } from './types';

function App() {
  const [pythonCode, setPythonCode] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeCode = useCallback(async () => {
    if (!pythonCode.trim()) return;
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setChatHistory([]);
    try {
      const result = await analyzeCode(pythonCode);
      setAnalysisResult(result);
      setChatHistory([{
        sender: 'bot',
        text: `Analysis complete! I've summarized your code and calculated some metrics. What would you like to know?`
      }]);
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'An unknown error occurred.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [pythonCode]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !analysisResult) return;
    
    const userMessage: ChatMessage = { sender: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      const stream = askQuestionStream(message);
      let botResponse = '';
      
      setChatHistory(prev => [...prev, { sender: 'bot', text: '' }]);

      for await (const chunk of stream) {
        botResponse += chunk;
        setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length-1].text = botResponse;
            return newHistory;
        });
      }

    } catch (e) {
      const err = e as Error;
      setError(err.message || 'An unknown error occurred during chat.');
      setChatHistory(prev => [...prev, {sender: 'bot', text: `Sorry, I encountered an error: ${err.message}`}]);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [analysisResult]);


  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-500">
          Python Code Analyst
        </h1>
        <p className="mt-2 text-lg text-slate-500">Powered by Google Gemini</p>
      </header>
      <main className="max-w-screen-2xl mx-auto h-[calc(100vh-12rem)] min-h-[600px] grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CodeInputPanel 
          code={pythonCode} 
          setCode={setPythonCode}
          onAnalyze={handleAnalyzeCode}
          isLoading={isLoading && !analysisResult} // only show loading on panel during initial analysis
          error={error}
        />
        <ChatPanel 
          analysisResult={analysisResult}
          chatHistory={chatHistory}
          onSendMessage={handleSendMessage}
          isLoading={isLoading && !!analysisResult} // only show loading on chat when analysis is done
        />
      </main>
    </div>
  );
}

export default App;
