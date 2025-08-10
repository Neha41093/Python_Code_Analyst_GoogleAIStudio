
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'A concise, one-sentence summary of the Python code\'s primary function or purpose.',
    },
    metrics: {
      type: Type.OBJECT,
      properties: {
        lineCount: {
          type: Type.INTEGER,
          description: 'The total number of lines in the code.',
        },
        functionCount: {
          type: Type.INTEGER,
          description: 'The total number of defined functions.',
        },
        classCount: {
          type: Type.INTEGER,
          description: 'The total number of defined classes.',
        },
        complexity: {
          type: Type.STRING,
          enum: ['Low', 'Medium', 'High', 'Very High'],
          description: 'An estimated cyclomatic complexity category for the code.',
        },
      },
      required: ['lineCount', 'functionCount', 'classCount', 'complexity'],
    },
    overview: {
        type: Type.STRING,
        description: 'A brief, high-level overview of what the code does, suitable for a non-technical audience.'
    }
  },
  required: ['summary', 'metrics', 'overview'],
};

let chatSession: Chat | null = null;

export const analyzeCode = async (code: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following Python code and provide a summary, metrics, and an overview.
      ---
      CODE:
      \`\`\`python
      ${code}
      \`\`\`
      ---
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Start a new chat session after successful analysis
    chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `You are an expert Python code assistant. You have just analyzed the following code and provided a summary. Now, answer the user's follow-up questions based ONLY on this code. Do not invent information. Be concise and helpful.
          
          --- PYTHON CODE ---
          ${code}
          --- END CODE ---
          `,
        },
    });

    return result as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing code:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze code with Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred during code analysis.");
  }
};

export const askQuestionStream = async function* (question: string): AsyncGenerator<string> {
    if (!chatSession) {
        throw new Error("Chat session not initialized. Please analyze code first.");
    }

    try {
        const stream = await chatSession.sendMessageStream({ message: question });

        for await (const chunk of stream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error in chat session:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get chat response from Gemini API: ${error.message}`);
        }
        throw new Error("An unknown error occurred during the chat session.");
    }
}
