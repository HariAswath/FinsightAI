import axios from 'axios';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequestOptions {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

/**
 * Centralized LLM Client supporting Groq, OpenAI, and high-fidelity deterministic fallback.
 * Adheres to Section 10 of docs/IMPLEMENTATION.md.
 */
export class CentralizedLLMClient {
  private groqApiKey?: string;
  private openaiApiKey?: string;
  private groqModel: string = 'openai/gpt-oss-120b';
  private openaiModel: string = 'gpt-4o-mini';
  private groqBaseUrl = 'https://api.groq.com/openai/v1';

  constructor() {
    this.refreshConfig();
  }

  public refreshConfig(): void {
    this.groqApiKey = process.env.GROQ_API_KEY || '';
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
    this.openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  public hasActiveKey(): boolean {
    this.refreshConfig();
    return Boolean(this.groqApiKey || this.openaiApiKey);
  }

  public getActiveProviderName(): string {
    this.refreshConfig();
    if (this.groqApiKey) return `Groq (${this.groqModel})`;
    if (this.openaiApiKey) return `OpenAI (${this.openaiModel})`;
    return 'Finsight Deterministic Engine (Offline)';
  }

  /**
   * Request structured JSON completion from LLM with automatic fallback.
   */
  public async generateStructuredJSON<T>(
    messages: ChatMessage[],
    options: LLMRequestOptions = {},
    fallbackGenerator: () => T
  ): Promise<{ data: T; isFallback: boolean; provider: string }> {
    this.refreshConfig();

    // 1. Try Groq if key exists
    if (this.groqApiKey) {
      const candidateModels = [this.groqModel, 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
      const uniqueModels = Array.from(new Set(candidateModels));

      for (const model of uniqueModels) {
        try {
          const result = await this.callOpenAICompatibleEndpoint<T>(
            this.groqBaseUrl,
            this.groqApiKey,
            model,
            messages,
            options
          );
          return { data: result, isFallback: false, provider: `Groq (${model})` };
        } catch (err: any) {
          const errMsg = err.response?.data?.error?.message || err.message;
          // If 404 (model not found), try next model in candidate list
          if (err.response?.status === 404 && model !== uniqueModels[uniqueModels.length - 1]) {
            continue;
          }
          console.warn(`[LLMClient] Groq model ${model} failed (${errMsg}). Trying next or fallback...`);
        }
      }
    }

    // 2. Try OpenAI if key exists
    if (this.openaiApiKey) {
      try {
        const result = await this.callOpenAICompatibleEndpoint<T>(
          'https://api.openai.com/v1',
          this.openaiApiKey,
          this.openaiModel,
          messages,
          options
        );
        return { data: result, isFallback: false, provider: `OpenAI (${this.openaiModel})` };
      } catch (err: any) {
        console.warn(`[LLMClient] OpenAI call failed (${err.message}). Using deterministic fallback...`);
      }
    }

    // 3. Graceful Deterministic Fallback
    const fallbackData = fallbackGenerator();
    return {
      data: fallbackData,
      isFallback: true,
      provider: 'Finsight Deterministic Reasoning Engine'
    };
  }

  private async callOpenAICompatibleEndpoint<T>(
    baseUrl: string,
    apiKey: string,
    model: string,
    messages: ChatMessage[],
    options: LLMRequestOptions
  ): Promise<T> {
    const payload: any = {
      model,
      messages,
      temperature: options.temperature ?? 0.1,
      max_tokens: options.maxTokens ?? 800
    };

    // Only apply strict response_format for OpenAI endpoints;
    // For Groq with open-source models (gpt-oss-120b, qwen), strict response_format triggers HTTP 400.
    const isGroq = baseUrl.includes('groq.com');
    if (!isGroq && options.jsonMode !== false) {
      payload.response_format = { type: 'json_object' };
    }

    let response: any;
    try {
      response = await axios.post(`${baseUrl}/chat/completions`, payload, {
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 second timeout to prevent pipeline hang
      });
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message?.toLowerCase() || '';
      // If Groq or provider rejects with a json formatting error, retry once with jsonMode false
      if (options.jsonMode !== false && (errMsg.includes('json') || err.response?.status === 400)) {
        return this.callOpenAICompatibleEndpoint<T>(baseUrl, apiKey, model, messages, {
          ...options,
          jsonMode: false
        });
      }
      throw err;
    }

    const content = response.data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from LLM provider');
    }

    // Extract JSON if wrapped in markdown code blocks or surrounding commentary
    let jsonString = content.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Safely isolate the outermost { ... }
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(jsonString) as T;
  }
}

export const llmClient = new CentralizedLLMClient();
