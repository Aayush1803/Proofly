import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    // Block if email is already registered
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Try signing in.' },
        { status: 400 },
      );
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Invalidate any previous unused OTPs for this email
    await prisma.otpCode.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    // Persist new OTP
    await prisma.otpCode.create({ data: { email, code, expiresAt } });

    // ── Send email ────────────────────────────────────────────────────────────
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Proofly AI <noreply@proofly.ai>',
        to: email,
        subject: `${code} — Your Proofly verification code`,
        html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="480" style="background:#111118;border-radius:16px;border:1px solid #1E1E2E;overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#4F8EFF,#7C3AED);padding:24px 32px;">
            <span style="color:#fff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">🛡️ Proofly AI</span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;">
            <p style="color:#8A8AA0;margin:0 0 8px;font-size:14px;">Your one-time verification code:</p>
            <div style="font-size:52px;font-weight:900;letter-spacing:12px;color:#fff;font-family:monospace;margin:20px 0 8px;">${code}</div>
            <p style="color:#4A4A60;font-size:13px;margin:0 0 32px;">
              This code expires in <strong style="color:#fff;">5 minutes</strong>.
              Do not share it with anyone.
            </p>
            <hr style="border:none;border-top:1px solid #1E1E2E;margin:0 0 24px;" />
            <p style="color:#4A4A60;font-size:12px;margin:0;">
              If you didn't request this, you can safely ignore this email.
              This is an automated message from Proofly — India's AI Fact-Checker.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      });
    } else {
      // Development fallback — log to server console
      console.log(`\n[OTP DEV] ─────────────────────────────`);
      console.log(`[OTP DEV] Email : ${email}`);
      console.log(`[OTP DEV] Code  : ${code}`);
      console.log(`[OTP DEV] Exp   : ${expiresAt.toISOString()}`);
      console.log(`[OTP DEV] ─────────────────────────────\n`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[send-otp] Error:', err);
    return NextResponse.json(
      { error: 'Failed to send verification code. Please try again.' },
      { status: 500 },
    );
  }
}
