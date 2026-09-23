import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { memoryStore } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { userId } = JSON.parse(session.value);
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    try {
      const where: Record<string, unknown> = { userId };

      if (type && type !== 'all') {
        where.type = type.toUpperCase();
      }

      if (tag) {
        where.tags = { some: { tag: { contains: tag, mode: 'insensitive' } } };
      }

      if (search) {
        where.originalName = { contains: search, mode: 'insensitive' };
      }

      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where,
          include: { tags: true },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.media.count({ where }),
      ]);

      return NextResponse.json({
        media,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (dbErr) {
      console.warn('DB error, using memory store for media list:', dbErr);
      let media = memoryStore.getMedia();

      if (type && type !== 'all') {
        media = media.filter((m) => m.type.toLowerCase() === type.toLowerCase());
      }
      if (search) {
        media = media.filter((m) =>
          m.originalName.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (tag) {
        media = media.filter((m) =>
          m.tags.some((t) => t.tag.toLowerCase().includes(tag.toLowerCase()))
        );
      }

      const total = media.length;
      const paginated = media.slice((page - 1) * limit, page * limit);

      return NextResponse.json({
        media: paginated,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  } catch (error) {
    console.error('Media list error:', error);
    return NextResponse.json({ error: 'Erro ao buscar mídias' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { userId } = JSON.parse(session.value);
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
    }

    try {
      await prisma.media.delete({
        where: { id, userId },
      });
    } catch {
      memoryStore.deleteMedia(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json({ error: 'Erro ao deletar mídia' }, { status: 500 });
  }
}
