import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { memoryStore, StoredPost } from '@/lib/store';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { userId } = JSON.parse(session.value);
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const search = searchParams.get('search');

    try {
      const where: Record<string, unknown> = { userId };

      if (status && status !== 'ALL') {
        where.status = status;
      }
      if (platform && platform !== 'ALL') {
        where.platform = platform;
      }
      if (search) {
        where.caption = { contains: search, mode: 'insensitive' };
      }

      const posts = await prisma.post.findMany({
        where,
        include: {
          postMedia: {
            include: { media: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ posts });
    } catch (dbErr) {
      console.warn('DB error, using memory store for posts:', dbErr);
      let posts = memoryStore.getPosts();

      if (status && status !== 'ALL') {
        posts = posts.filter((p) => p.status === status);
      }
      if (platform && platform !== 'ALL') {
        posts = posts.filter((p) => p.platform === platform || p.platform === 'BOTH');
      }
      if (search) {
        posts = posts.filter((p) =>
          p.caption.toLowerCase().includes(search.toLowerCase())
        );
      }

      return NextResponse.json({ posts });
    }
  } catch (error) {
    console.error('List posts error:', error);
    return NextResponse.json({ error: 'Erro ao listar posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { userId } = JSON.parse(session.value);
    const body = await request.json();

    const {
      caption,
      hashtags,
      cta,
      platform = 'BOTH',
      postType = 'FEED',
      status = 'DRAFT',
      scheduledAt,
      mediaId,
      aiGenerated = false,
    } = body;

    if (!caption && !mediaId) {
      return NextResponse.json(
        { error: 'Post precisa conter legenda ou mídia' },
        { status: 400 }
      );
    }

    const newPostId = randomUUID();

    try {
      const createdPost = await prisma.post.create({
        data: {
          id: newPostId,
          userId,
          caption,
          hashtags,
          cta,
          platform,
          postType,
          status,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          publishedAt: status === 'PUBLISHED' ? new Date() : null,
          aiGenerated,
          postMedia: mediaId
            ? {
                create: {
                  mediaId,
                  order: 0,
                },
              }
            : undefined,
        },
        include: {
          postMedia: {
            include: { media: true },
          },
        },
      });

      return NextResponse.json({ success: true, post: createdPost });
    } catch (dbErr) {
      console.warn('DB create failed, saving to memory store:', dbErr);

      // Find associated media if any
      const allMedia = memoryStore.getMedia();
      const selectedMedia = allMedia.find((m) => m.id === mediaId) || allMedia[0];

      const memoryPost: StoredPost = {
        id: newPostId,
        userId,
        caption: caption || '',
        hashtags,
        cta,
        platform,
        postType,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null,
        aiGenerated,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        postMedia: selectedMedia
          ? [
              {
                id: `pm-${Date.now()}`,
                postId: newPostId,
                mediaId: selectedMedia.id,
                order: 0,
                media: selectedMedia,
              },
            ]
          : [],
      };

      memoryStore.addPost(memoryPost);
      return NextResponse.json({ success: true, post: memoryPost });
    }
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 });
  }
}
