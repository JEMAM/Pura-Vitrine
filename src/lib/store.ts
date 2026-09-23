// Shared memory store for local development when PostgreSQL is not running
export interface StoredTag {
  id: string;
  tag: string;
  category: 'SERVICE' | 'PROFESSIONAL' | 'AUTO' | 'MANUAL';
}

export interface StoredMedia {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  thumbnailPath: string | null;
  type: 'IMAGE' | 'VIDEO';
  createdAt: string;
  updatedAt: string;
  tags: StoredTag[];
  aiAnalysis?: Record<string, unknown> | null;
}

export interface StoredPostMedia {
  id: string;
  postId: string;
  mediaId: string;
  order: number;
  media: StoredMedia;
}

export interface StoredPost {
  id: string;
  userId: string;
  caption: string;
  hashtags?: string;
  cta?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'BOTH';
  postType: 'FEED' | 'STORY' | 'REEL';
  scheduledAt?: string | null;
  publishedAt?: string | null;
  metrics?: {
    likes?: number;
    comments?: number;
    reach?: number;
    shares?: number;
  };
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  postMedia: StoredPostMedia[];
}

export interface SalonSettings {
  salonName: string;
  phone: string;
  instagram: string;
  tone: string;
  targetAudience: string;
  services: string[];
  professionals: string[];
  instagramConnected: boolean;
  facebookConnected: boolean;
  geminiModel: string;
}

// In-memory demo data with realistic beauty salon content
const defaultMedia: StoredMedia[] = [
  {
    id: 'media-1',
    userId: 'admin-demo-id',
    filename: 'morena-iluminada.jpg',
    originalName: 'Morena_Iluminada_Procedimento.jpg',
    mimeType: 'image/jpeg',
    size: 2450000,
    path: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
    thumbnailPath: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=400&q=80',
    type: 'IMAGE',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
    tags: [
      { id: 'tag-1', tag: 'Cabelo', category: 'SERVICE' },
      { id: 'tag-2', tag: 'Morena Iluminada', category: 'AUTO' },
      { id: 'tag-3', tag: 'Dra. Camila', category: 'PROFESSIONAL' },
      { id: 'tag-4', tag: 'Antes e Depois', category: 'AUTO' },
    ],
    aiAnalysis: {
      score: 9.4,
      lighting: 'Excelente iluminação natural com destaque para o brilho dos fios dourados e avelã.',
      recommendation: 'Ideal para post de Feed formato 4:5 e Reel de transformação.',
    },
  },
  {
    id: 'media-2',
    userId: 'admin-demo-id',
    filename: 'unhas-gel-francesinha.jpg',
    originalName: 'Unhas_Gel_Encapsulada.jpg',
    mimeType: 'image/jpeg',
    size: 1820000,
    path: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    thumbnailPath: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80',
    type: 'IMAGE',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 4).toISOString(),
    tags: [
      { id: 'tag-5', tag: 'Unhas', category: 'SERVICE' },
      { id: 'tag-6', tag: 'Alongamento em Gel', category: 'AUTO' },
      { id: 'tag-7', tag: 'Nail Art', category: 'AUTO' },
    ],
    aiAnalysis: {
      score: 8.9,
      lighting: 'Foco perfeito no acabamento e na cutícula.',
      recommendation: 'Excelente para Story com enquete "Qual formato você prefere?".',
    },
  },
  {
    id: 'media-3',
    userId: 'admin-demo-id',
    filename: 'estetica-facial.jpg',
    originalName: 'Limpeza_Pele_Profunda.jpg',
    mimeType: 'image/jpeg',
    size: 3100000,
    path: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    thumbnailPath: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
    type: 'IMAGE',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 6).toISOString(),
    tags: [
      { id: 'tag-8', tag: 'Estética', category: 'SERVICE' },
      { id: 'tag-9', tag: 'Skincare', category: 'AUTO' },
      { id: 'tag-10', tag: 'Glow Facial', category: 'AUTO' },
    ],
    aiAnalysis: {
      score: 9.1,
      lighting: 'Clima relaxante com boa fidelidade de textura de pele.',
      recommendation: 'Perfeito para post educativo sobre cuidados pós-procedimento.',
    },
  },
];

const defaultPosts: StoredPost[] = [
  {
    id: 'post-1',
    userId: 'admin-demo-id',
    caption:
      'Ilumine seus fios sem perder a saúde capilar! ✨\n\nA técnica Morena Iluminada traz nuances quentes de avelã e mel que valorizam o tom de pele com elegância e sofisticação incomparáveis.\n\nQual tom é o seu favorito?',
    hashtags: '#salaodebeleza #morenailuminada #cabeloperfeito #mechasavelã #haircare #transformacaocapilar',
    cta: 'Agende seu horário pelo link na bio ou nos chame no direct! 💬',
    status: 'PUBLISHED',
    platform: 'BOTH',
    postType: 'FEED',
    publishedAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
    metrics: {
      likes: 342,
      comments: 48,
      reach: 2850,
      shares: 19,
    },
    aiGenerated: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
    postMedia: [
      {
        id: 'pm-1',
        postId: 'post-1',
        mediaId: 'media-1',
        order: 0,
        media: defaultMedia[0],
      },
    ],
  },
  {
    id: 'post-2',
    userId: 'admin-demo-id',
    caption:
      'Unhas impecáveis duram até 4 semanas com a nossa técnica de Gel Estruturado! 💅✨\n\nAcabamento ultrafino, resistência e um brilho espelhado que não descasca. Quem ama esse estilo?',
    hashtags: '#unhasemgel #nailart #unhasdelicadas #alongamentodeunhas #beleza #manicuretop',
    cta: 'Comente "EU QUERO" para garantir seu voucher exclusivo de primeira aplicação! 💕',
    status: 'SCHEDULED',
    platform: 'INSTAGRAM',
    postType: 'FEED',
    scheduledAt: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
    aiGenerated: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    postMedia: [
      {
        id: 'pm-2',
        postId: 'post-2',
        mediaId: 'media-2',
        order: 0,
        media: defaultMedia[1],
      },
    ],
  },
  {
    id: 'post-3',
    userId: 'admin-demo-id',
    caption:
      'Sua pele merece esse momento de renovação e autocuidado. ✨\n\nA limpeza profunda combinada com fototerapia devolve o viço natural e desobstrui os poros suavemente.',
    hashtags: '#esteticafacial #skincare #limpezadepele #pelelimpa #glowskin #autocuidado',
    cta: 'Restam apenas 3 vagas para sexta-feira! Clique no link da bio para reservar.',
    status: 'DRAFT',
    platform: 'BOTH',
    postType: 'FEED',
    aiGenerated: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    postMedia: [
      {
        id: 'pm-3',
        postId: 'post-3',
        mediaId: 'media-3',
        order: 0,
        media: defaultMedia[2],
      },
    ],
  },
];

let salonSettings: SalonSettings = {
  salonName: 'Studio Beleza & Elegância',
  phone: '(11) 98765-4321',
  instagram: '@studiobelezasp',
  tone: 'Elegante, acolhedor e focado em alta autoestima',
  targetAudience: 'Mulheres de 22 a 50 anos que valorizam cuidados pessoais e estética premium',
  services: ['Cabelos (Mechas, Cortes, Escova)', 'Unhas (Gel, Fibra, Esmaltação)', 'Estética Facial e Corporal', 'Sobrancelhas e Cílios'],
  professionals: ['Camila Rocha (Colorista)', 'Juliana Prado (Nail Designer)', 'Patrícia Mendes (Esteticista)'],
  instagramConnected: true,
  facebookConnected: true,
  geminiModel: 'gemini-1.5-flash',
};

// Global persistence across hot reload
const globalStore = globalThis as unknown as {
  __demoMedia?: StoredMedia[];
  __demoPosts?: StoredPost[];
  __demoSettings?: SalonSettings;
};

if (!globalStore.__demoMedia) globalStore.__demoMedia = defaultMedia;
if (!globalStore.__demoPosts) globalStore.__demoPosts = defaultPosts;
if (!globalStore.__demoSettings) globalStore.__demoSettings = salonSettings;

export const memoryStore = {
  getMedia: () => globalStore.__demoMedia!,
  addMedia: (media: StoredMedia) => {
    globalStore.__demoMedia!.unshift(media);
    return media;
  },
  deleteMedia: (id: string) => {
    globalStore.__demoMedia = globalStore.__demoMedia!.filter((m) => m.id !== id);
  },
  getPosts: () => globalStore.__demoPosts!,
  addPost: (post: StoredPost) => {
    globalStore.__demoPosts!.unshift(post);
    return post;
  },
  updatePost: (id: string, updates: Partial<StoredPost>) => {
    const post = globalStore.__demoPosts!.find((p) => p.id === id);
    if (post) {
      Object.assign(post, updates, { updatedAt: new Date().toISOString() });
      return post;
    }
    return null;
  },
  deletePost: (id: string) => {
    globalStore.__demoPosts = globalStore.__demoPosts!.filter((p) => p.id !== id);
  },
  getSettings: () => globalStore.__demoSettings!,
  updateSettings: (updates: Partial<SalonSettings>) => {
    Object.assign(globalStore.__demoSettings!, updates);
    return globalStore.__demoSettings!;
  },
};
