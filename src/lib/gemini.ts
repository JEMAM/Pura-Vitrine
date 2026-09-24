import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
export { AVAILABLE_GEMINI_MODELS } from './gemini-models';
export type { GeminiModelOption } from './gemini-models';

export function getGeminiApiKey(): string {
  return process.env.GEMINI_API_KEY || '';
}

export function getGeminiClient(): GoogleGenerativeAI {
  const key = getGeminiApiKey();
  return new GoogleGenerativeAI(key);
}

export const FALLBACK_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

export const activeModelName = 'gemini-3.6-flash';

export function getModelFallbackList(preferredModel?: string): string[] {
  if (!preferredModel) return FALLBACK_MODELS;
  const list = [preferredModel, ...FALLBACK_MODELS.filter((m) => m !== preferredModel)];
  return Array.from(new Set(list));
}

export async function generateContentWithFallback(
  genAI: GoogleGenerativeAI,
  prompt: string,
  options?: {
    models?: string[];
    generationConfig?: GenerationConfig;
  }
): Promise<{ text: string; modelUsed: string }> {
  const models = options?.models || FALLBACK_MODELS;
  let lastError: any = null;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: options?.generationConfig,
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      if (text) {
        return { text, modelUsed: modelName };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Fallback] Model ${modelName} erro: ${err?.message || err}. Tentando próximo modelo...`);
    }
  }

  throw lastError || new Error('Todos os modelos Gemini falharam na geração.');
}

export default getGeminiClient;
