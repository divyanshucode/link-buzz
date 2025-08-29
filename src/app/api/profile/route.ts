import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { JWTPayload } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Function to handle PUT (update) requests for the user's profile
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = verify(token, JWT_SECRET) as JWTPayload;

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { username, currentPassword, newPassword } = await request.json();

    // Handle username update
    if (username !== undefined) {
      if (!username || username.length < 3) {
        return NextResponse.json(
          { error: 'Username must be at least 3 characters long' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { username: username },
      });

      return NextResponse.json(updatedUser, { status: 200 });
    }

    // Handle password update
    if (currentPassword && newPassword) {
      // Validate new password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' },
          { status: 400 }
        );
      }

      // Get current user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update password in database
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: hashedNewPassword },
      });

      return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
    }

    return NextResponse.json({ error: 'No valid update data provided' }, { status: 400 });
  } catch (error) {
    // This specifically catches the error if the new username is already taken
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'This username is already taken.' },
        { status: 409 } // 409 Conflict
      );
    }

    console.error('UPDATE_PROFILE_ERROR', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}