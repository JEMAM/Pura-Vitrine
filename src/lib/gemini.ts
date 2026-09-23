import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Force load .env.local with override: true so local key takes precedence over stale OS variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

export function getGeminiApiKey(): string {
  return process.env.GEMINI_API_KEY || '';
}

export function getGeminiClient(): GoogleGenerativeAI {
  const key = getGeminiApiKey();
  return new GoogleGenerativeAI(key);
}

export const activeModelName = 'gemini-3.1-flash-lite';

export default getGeminiClient;
