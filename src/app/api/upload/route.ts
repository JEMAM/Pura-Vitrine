import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import prisma from '@/lib/prisma';
import { ACCEPTED_MEDIA_TYPES, MAX_FILE_SIZE, isImage } from '@/lib/utils';
import { memoryStore, StoredMedia, StoredTag } from '@/lib/store';
import { GoogleGenerativeAI } from '@google/generative-ai';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

async function ensureDir(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch {}
}

/** Extrai tags automáticas com base no Gemini Vision ou regras de nicho de beleza */
async function generateBeautyTags(
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'sua-chave-gemini-aqui' && isImage(mimeType)) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
      const prompt =
        'Analise esta foto de um salão de beleza e retorne apenas uma lista de 3 a 5 tags curtas separadas por vírgula em português (ex: Cabelo, Morena Iluminada, Loiro, Unhas em Gel, Nail Art, Limpeza de Pele, Penteado, Maquiagem). Seja conciso e retorne apenas as palavras-chave separadas por vírgula.';

      const imagePart = {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType,
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const text = result.response.text();
      const tags = text
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter((t) => t.length > 1 && t.length < 30);

      if (tags.length > 0) return tags;
    } catch (e) {
      console.warn('Gemini auto-tagging failed, using heuristic fallback:', e);
    }
  }

  // Heurística de fallback inteligente para salão baseada no nome do arquivo
  const lowerName = fileName.toLowerCase();
  const detectedTags: string[] = [];

  if (/cabelo|hair|mechas|loiro|morena|corte|escova|botox|ruivo|penteado/.test(lowerName)) {
    detectedTags.push('Cabelo');
    if (/mecha|loiro|morena/.test(lowerName)) detectedTags.push('Mechas');
    if (/corte/.test(lowerName)) detectedTags.push('Corte');
    if (/antes|depois/.test(lowerName)) detectedTags.push('Antes e Depois');
  } else if (/unha|nail|gel|fibra|manicure|pedicure|esmalte/.test(lowerName)) {
    detectedTags.push('Unhas');
    if (/gel|fibra/.test(lowerName)) detectedTags.push('Alongamento');
    if (/art|decorada|francesinha/.test(lowerName)) detectedTags.push('Nail Art');
  } else if (/pele|facial|estetica|skincare|limpeza|massagem|botox/.test(lowerName)) {
    detectedTags.push('Estética');
    detectedTags.push('Skincare');
  } else {
    detectedTags.push('Salão', 'Procedimento');
  }

  return detectedTags;
}

export async function POST(request: NextRequest) {
  try {
    // Check auth
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { userId } = JSON.parse(session.value);

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      if (!ACCEPTED_MEDIA_TYPES.includes(file.type)) {
        errors.push({ file: file.name, error: 'Tipo de arquivo não suportado' });
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push({ file: file.name, error: 'Arquivo muito grande (máx 50MB)' });
        continue;
      }

      const id = randomUUID();
      const ext = file.name.split('.').pop() || 'bin';
      const filename = `${id}.${ext}`;
      const type = isImage(file.type) ? 'IMAGE' : 'VIDEO';

      const originalsDir = join(UPLOAD_DIR, 'originals');
      const thumbnailsDir = join(UPLOAD_DIR, 'thumbnails');
      const buffer = Buffer.from(await file.arrayBuffer());

      let mediaPath = `/uploads/originals/${filename}`;
      try {
        await ensureDir(originalsDir);
        await ensureDir(thumbnailsDir);
        const filePath = join(originalsDir, filename);
        await writeFile(filePath, buffer);
      } catch (fsErr) {
        console.warn('Local disk write failed (Vercel serverless read-only filesystem). Using data URI fallback:', fsErr);
        mediaPath = `data:${file.type};base64,${buffer.toString('base64')}`;
      }

      const autoTags = await generateBeautyTags(file.name, buffer, file.type);

      let mediaRecord;
      try {
        mediaRecord = await prisma.media.create({
          data: {
            userId,
            filename,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            path: mediaPath,
            thumbnailPath: type === 'IMAGE' ? mediaPath : null,
            type: type as 'IMAGE' | 'VIDEO',
            metadata: {},
            tags: {
              create: autoTags.map((tag) => ({
                tag,
                category: 'AUTO',
              })),
            },
          },
          include: {
            tags: true,
          },
        });
      } catch (dbErr) {
        console.warn('DB write failed, storing in memory store:', dbErr);
        const storedTags: StoredTag[] = autoTags.map((tag, idx) => ({
          id: `tag-${Date.now()}-${idx}`,
          tag,
          category: 'AUTO',
        }));

        const newMedia: StoredMedia = {
          id,
          userId,
          filename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          path: mediaPath,
          thumbnailPath: type === 'IMAGE' ? mediaPath : null,
          type: type as 'IMAGE' | 'VIDEO',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: storedTags,
          aiAnalysis: {
            tags: autoTags,
            detectedAt: new Date().toISOString(),
          },
        };

        memoryStore.addMedia(newMedia);
        mediaRecord = newMedia;
      }

      results.push(mediaRecord);
    }

    return NextResponse.json({
      uploaded: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 });
  }
}
