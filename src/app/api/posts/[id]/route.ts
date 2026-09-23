import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { memoryStore } from '@/lib/store';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          postMedia: {
            include: { media: true },
          },
        },
      });
      if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
      return NextResponse.json({ post });
    } catch {
      const post = memoryStore.getPosts().find((p) => p.id === id);
      if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
      return NextResponse.json({ post });
    }
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json({ error: 'Erro ao buscar post' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    try {
      const updated = await prisma.post.update({
        where: { id },
        data: {
          caption: body.caption,
          hashtags: body.hashtags,
          cta: body.cta,
          status: body.status,
          platform: body.platform,
          postType: body.postType,
          scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
          publishedAt: body.status === 'PUBLISHED' ? new Date() : undefined,
        },
        include: {
          postMedia: {
            include: { media: true },
          },
        },
      });
      return NextResponse.json({ success: true, post: updated });
    } catch {
      const updated = memoryStore.updatePost(id, {
        ...body,
        publishedAt: body.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
      });
      return NextResponse.json({ success: true, post: updated });
    }
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    try {
      await prisma.post.delete({ where: { id } });
    } catch {
      memoryStore.deletePost(id);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Erro ao deletar post' }, { status: 500 });
  }
}
