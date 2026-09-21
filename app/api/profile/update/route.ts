import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const body = await req.json();

  const { name, bio, avatarUrl } = body;

  // Validate
  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined     && { name: name.trim() }),
      ...(bio !== undefined      && { bio: bio.trim() || null }),
      ...(avatarUrl !== undefined && { avatarUrl: avatarUrl || null }),
    },
    select: { id: true, name: true, email: true, bio: true, avatarUrl: true, image: true },
  });

  return NextResponse.json({ ok: true, user: updated });
}
