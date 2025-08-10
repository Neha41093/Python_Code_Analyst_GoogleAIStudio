
import React from 'react';
import type { ChangeEvent } from 'react';
import { CodeIcon } from './icons';

interface CodeInputPanelProps {
  code: string;
  setCode: (code: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  error: string | null;
}

const placeholderCode = `
import pandas as pd

class DataAnalyzer:
    def __init__(self, filepath):
        self.df = pd.read_csv(filepath)

    def get_summary(self):
        return self.df.describe()

    def get_shape(self):
        """Returns the shape of the dataframe."""
        return self.df.shape

if __name__ == "__main__":
    analyzer = DataAnalyzer("data.csv")
    print("Shape:", analyzer.get_shape())
`;

export const CodeInputPanel: React.FC<CodeInputPanelProps> = ({ code, setCode, onAnalyze, isLoading, error }) => {
  const handleCodeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center mb-4 text-slate-700">
        <CodeIcon className="w-8 h-8 mr-3 text-blue-500" />
        <h2 className="text-2xl font-bold tracking-tight">Python Code Input</h2>
      </div>
      <p className="text-slate-500 mb-4 text-sm">Paste your Python code below. The AI will analyze it to provide metrics, a summary, and answer your questions.</p>
      
      <div className="flex-grow flex flex-col relative">
          <textarea
            value={code}
            onChange={handleCodeChange}
            placeholder={placeholderCode.trim()}
            className="flex-grow w-full p-4 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-colors"
            spellCheck="false"
          />
      </div>

      <div className="mt-4">
        <button
          onClick={onAnalyze}
          disabled={isLoading || !code.trim()}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : 'Analyze Code'}
        </button>
        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
};