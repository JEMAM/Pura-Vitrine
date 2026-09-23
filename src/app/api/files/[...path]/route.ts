import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<'/api/files/[...path]'>
) {
  try {
    const params = await ctx.params;
    const filePath = Array.isArray(params.path) ? params.path.join('/') : params.path;
    const absolutePath = join(process.cwd(), 'uploads', filePath);

    // Check file exists
    try {
      await stat(absolutePath);
    } catch {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 });
    }

    const buffer = await readFile(absolutePath);

    // Determine content type
    const ext = absolutePath.split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      webm: 'video/webm',
    };

    const contentType = contentTypes[ext || ''] || 'application/octet-stream';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('File serve error:', error);
    return NextResponse.json({ error: 'Erro ao servir arquivo' }, { status: 500 });
  }
}
