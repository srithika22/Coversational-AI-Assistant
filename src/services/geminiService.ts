
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private conversationHistory: Array<{role: string, content: string}> = [];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string, isSmartCommand: boolean = false): Promise<string> {
    try {
      this.conversationHistory.push({ role: 'user', content: prompt });

      let systemContext = '';
      
      if (isSmartCommand) {
        systemContext = `You are Rishi, an advanced multilingual AI assistant integrated into a smart home system. You can:

1. Control smart devices (lights, fans, AC, TV) in different rooms - respond naturally when devices are controlled
2. Add new devices when requested - confirm device addition with details
3. Remove devices when requested - confirm device removal
4. Set time-based reminders with voice notifications - confirm reminder details
5. Delete reminders when requested - confirm reminder deletion
6. Answer ANY question like ChatGPT in multiple languages (English, Telugu, Hindi)
7. Provide detailed cooking recipes and instructions when asked about dishes
8. Recommend music and entertainment content
9. Support voice commands and respond in the user's preferred language
10. Connect to real IoT devices for actual smart home control

For device commands, provide natural confirmations.
For cooking questions, provide detailed step-by-step recipes.
For general questions, provide comprehensive, accurate answers.
For reminders, confirm the time and action clearly.
Always be conversational, intelligent, and multilingual.

Respond in the same language the user used, or in English if unclear.`;
      } else {
        systemContext = `You are Rishi, a highly intelligent multilingual AI assistant exactly like ChatGPT. You can answer ANY question on ANY topic in multiple languages (English, Telugu, Hindi):

- Programming languages, coding, software development, web development, mobile apps
- Science, mathematics, physics, chemistry, biology, astronomy
- History, literature, philosophy, arts, culture, religion
- Current events, news, trends, technology, AI, machine learning
- Creative writing, stories, poems, ideas, brainstorming
- Advice, recommendations, problem-solving, decision making
- Cooking recipes with detailed step-by-step instructions for any dish
- Music recommendations, entertainment, movies, books
- Business, economics, psychology, health, fitness, lifestyle
- Education, learning, study tips, career guidance
- Travel, geography, cultures around the world
- Sports, games, hobbies, DIY projects
- And literally anything else a user might ask

When asked about cooking/recipes:
- Provide detailed ingredients list with quantities
- Give step-by-step cooking instructions
- Include cooking times and temperatures
- Add helpful tips and variations
- Explain techniques if needed

Provide detailed, accurate, intelligent responses. Be conversational and engaging. Remember our conversation history for context. Respond in the same language the user used (English, Telugu, or Hindi).`;
      }

      const recentHistory = this.conversationHistory.slice(-10);
      const contextWithHistory = `${systemContext}

Recent conversation history:
${recentHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current user message: ${prompt}

Respond naturally and intelligently to this message, considering the full context of our conversation. If the user is asking in Telugu or Hindi, respond in that language. If asking about cooking, provide detailed recipes and instructions.`;

      const requestBody = {
        contents: [{
          parts: [{
            text: contextWithHistory
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        this.conversationHistory.push({ role: 'assistant', content: aiResponse });
        
        if (this.conversationHistory.length > 30) {
          this.conversationHistory = this.conversationHistory.slice(-30);
        }
        
        return aiResponse;
      }
      
      throw new Error('No response from Gemini API');
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getConversationHistory() {
    return this.conversationHistory;
  }
}
