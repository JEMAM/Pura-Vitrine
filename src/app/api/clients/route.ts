import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { memoryStore, StoredClient } from '@/lib/store';
import { randomUUID } from 'crypto';

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

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = getSessionUserId(cookieStore);
    const { searchParams } = new URL(request.url);

    const monthStr = searchParams.get('month');
    const dayStr = searchParams.get('day');
    const search = searchParams.get('search')?.trim().toLowerCase();

    const month = monthStr && monthStr !== 'ALL' ? parseInt(monthStr, 10) : undefined;
    const day = dayStr ? parseInt(dayStr, 10) : undefined;

    try {
      const where: Record<string, unknown> = { userId };

      if (month !== undefined && !isNaN(month)) {
        where.birthMonth = month;
      }
      if (day !== undefined && !isNaN(day)) {
        where.birthDay = day;
      }
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { preferredServices: { contains: search, mode: 'insensitive' } },
        ];
      }

      const clients = await prisma.client.findMany({
        where,
        orderBy: [{ birthMonth: 'asc' }, { birthDay: 'asc' }, { name: 'asc' }],
      });

      return NextResponse.json({ clients, source: 'database' });
    } catch (dbErr) {
      console.warn('DB error, using memoryStore for clients:', dbErr);
      let clients = memoryStore.getClients();

      if (month !== undefined && !isNaN(month)) {
        clients = clients.filter((c) => c.birthMonth === month);
      }
      if (day !== undefined && !isNaN(day)) {
        clients = clients.filter((c) => c.birthDay === day);
      }
      if (search) {
        clients = clients.filter(
          (c) =>
            c.name.toLowerCase().includes(search) ||
            c.phone.toLowerCase().includes(search) ||
            (c.email && c.email.toLowerCase().includes(search)) ||
            (c.preferredServices && c.preferredServices.toLowerCase().includes(search)) ||
            (c.notes && c.notes.toLowerCase().includes(search))
        );
      }

      // Ordenar por mês e dia
      clients.sort((a, b) => {
        if (a.birthMonth !== b.birthMonth) return a.birthMonth - b.birthMonth;
        if (a.birthDay !== b.birthDay) return a.birthDay - b.birthDay;
        return a.name.localeCompare(b.name);
      });

      return NextResponse.json({ clients, source: 'memory' });
    }
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar clientes', details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = getSessionUserId(cookieStore);

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

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nome do cliente é obrigatório.' }, { status: 400 });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: 'WhatsApp/Telefone é obrigatório para envio de mensagens.' },
        { status: 400 }
      );
    }

    const dayNum = parseInt(birthDay, 10);
    const monthNum = parseInt(birthMonth, 10);
    const yearNum = birthYear ? parseInt(birthYear, 10) : undefined;

    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      return NextResponse.json({ error: 'Dia de aniversário inválido (1 a 31).' }, { status: 400 });
    }

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return NextResponse.json({ error: 'Mês de aniversário inválido (1 a 12).' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const clientId = `client-${randomUUID().slice(0, 8)}`;

    const newClientData: StoredClient = {
      id: clientId,
      userId,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined,
      birthDay: dayNum,
      birthMonth: monthNum,
      birthYear: yearNum && !isNaN(yearNum) ? yearNum : undefined,
      instagram: instagram?.trim() || undefined,
      preferredServices: preferredServices?.trim() || undefined,
      notes: notes?.trim() || undefined,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    try {
      const created = await prisma.client.create({
        data: {
          id: clientId,
          userId,
          name: newClientData.name,
          phone: newClientData.phone,
          email: newClientData.email || null,
          birthDay: newClientData.birthDay,
          birthMonth: newClientData.birthMonth,
          birthYear: newClientData.birthYear || null,
          instagram: newClientData.instagram || null,
          preferredServices: newClientData.preferredServices || null,
          notes: newClientData.notes || null,
        },
      });

      // Também espelha no memoryStore para consistência imediata
      memoryStore.addClient(newClientData);

      return NextResponse.json({ client: created, source: 'database' }, { status: 201 });
    } catch (dbErr) {
      console.warn('DB error on create, saving in memoryStore:', dbErr);
      const created = memoryStore.addClient(newClientData);
      return NextResponse.json({ client: created, source: 'memory' }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Erro ao cadastrar cliente:', error);
    return NextResponse.json(
      { error: 'Falha ao cadastrar cliente', details: error?.message },
      { status: 500 }
    );
  }
}
