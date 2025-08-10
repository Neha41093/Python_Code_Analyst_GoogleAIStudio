
export interface Metrics {
  lineCount: number;
  functionCount: number;
  classCount: number;
  complexity: 'Low' | 'Medium' | 'High' | 'Very High';
}

export interface AnalysisResult {
  summary: string;
  metrics: Metrics;
  overview: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}
