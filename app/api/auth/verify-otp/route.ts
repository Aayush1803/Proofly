import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ valid: false, error: 'Email and code are required.' });
    }

    const otp = await prisma.otpCode.findFirst({
      where: {
        email,
        code: String(code),
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp) {
      return NextResponse.json({ valid: false, error: 'Invalid or expired code. Request a new one.' });
    }

    // Mark as used — cannot be replayed
    await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });

    return NextResponse.json({ valid: true });
  } catch (err) {
    console.error('[verify-otp] Error:', err);
    return NextResponse.json({ valid: false, error: 'Verification failed. Please try again.' });
  }
}
