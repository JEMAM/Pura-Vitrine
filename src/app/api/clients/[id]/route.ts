import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { memoryStore } from '@/lib/store';

function getSessionUserId(cookieStore: any): string {
  try {
    const session = cookieStore.get('session');
    if (session?.value) {
      const parsed = JSON.parse(session.value);
      if (parsed?.userId) return parsed.userId;
    }
  } catch {
    // fallback
  }
  return 'admin-demo-id';
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      phone,
      email,
      birthDay,
      birthMonth,
      birthYear,
      instagram,
      preferredServices,
      notes,
    } = body;

    const updates: Record<string, any> = {};

    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (email !== undefined) updates.email = email.trim() || null;
    if (birthDay !== undefined) {
      const d = parseInt(birthDay, 10);
      if (!isNaN(d) && d >= 1 && d <= 31) updates.birthDay = d;
    }
    if (birthMonth !== undefined) {
      const m = parseInt(birthMonth, 10);
      if (!isNaN(m) && m >= 1 && m <= 12) updates.birthMonth = m;
    }
    if (birthYear !== undefined) {
      const y = parseInt(birthYear, 10);
      updates.birthYear = !isNaN(y) ? y : null;
    }
    if (instagram !== undefined) updates.instagram = instagram.trim() || null;
    if (preferredServices !== undefined) updates.preferredServices = preferredServices.trim() || null;
    if (notes !== undefined) updates.notes = notes.trim() || null;

    try {
      const updated = await prisma.client.update({
        where: { id },
        data: updates,
      });

      // Atualiza também no memoryStore
      memoryStore.updateClient(id, updates);
      return NextResponse.json({ client: updated, source: 'database' });
    } catch (dbErr) {
      console.warn('DB error on update, updating in memoryStore:', dbErr);
      const updated = memoryStore.updateClient(id, updates);
      if (!updated) {
        return NextResponse.json({ error: 'Cliente não encontrado.' }, { status: 404 });
      }
      return NextResponse.json({ client: updated, source: 'memory' });
    }
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json(
      { error: 'Falha ao atualizar cliente', details: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      await prisma.client.delete({
        where: { id },
      });
      memoryStore.deleteClient(id);
      return NextResponse.json({ success: true, source: 'database' });
    } catch (dbErr) {
      console.warn('DB error on delete, deleting in memoryStore:', dbErr);
      memoryStore.deleteClient(id);
      return NextResponse.json({ success: true, source: 'memory' });
    }
  } catch (error: any) {
    console.error('Erro ao excluir cliente:', error);
    return NextResponse.json(
      { error: 'Falha ao excluir cliente', details: error?.message },
      { status: 500 }
    );
  }
}
