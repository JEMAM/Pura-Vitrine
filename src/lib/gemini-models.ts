export interface GeminiModelOption {
  id: string;
  name: string;
  badge?: string;
  description: string;
  isNew?: boolean;
  recommended?: boolean;
}

export const AVAILABLE_GEMINI_MODELS: GeminiModelOption[] = [
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    badge: 'Recomendado',
    description: 'Mais rápido, estável e ultra eficiente para geração diária de posts, legendas e roteiros.',
    recommended: true,
  },
  {
    id: 'gemini-3.7-flash',
    name: 'Gemini 3.7 Flash',
    badge: 'Nova Geração',
    description: 'Última geração com raciocínio multimodal aprofundado para tendências e análises visuais.',
    isNew: true,
  },
];
