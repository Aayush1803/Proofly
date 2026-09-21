import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  const [user, analyses, loginEvents] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        avatarUrl: true,
        bio: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { analyses: true } },
      },
    }),
    prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        inputSnippet: true,
        inputType: true,
        trustScore: true,
        language: true,
        claimsCount: true,
        createdAt: true,
      },
    }),
    prisma.loginEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, provider: true, createdAt: true },
    }),
  ]);

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Compute derived stats
  const totalClaims = await prisma.analysis.aggregate({
    where: { userId },
    _sum: { claimsCount: true },
  });

  const trustedCount = analyses.filter(a => a.trustScore >= 65).length;
  const misleadingCount = analyses.filter(a => a.trustScore >= 35 && a.trustScore < 65).length;
  const falseCount = analyses.filter(a => a.trustScore < 35).length;

  return NextResponse.json({
    user,
    stats: {
      totalAnalyses: user._count.analyses,
      totalClaims: totalClaims._sum.claimsCount ?? 0,
      trustedCount,
      misleadingCount,
      falseCount,
    },
    analyses,
    loginEvents,
  });
}
