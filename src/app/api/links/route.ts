import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { JWTPayload } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export  async function POST(request: Request) {
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

        const { title, url } = await request.json();

        if (!title || !url) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newLink = await prisma.link.create({
            data: {
                title,
                url,
                userId: userId
            }
        });

        return NextResponse.json(newLink, { status: 201 });
    } catch (error) {
        console.error('CREATE_LINK_ERROR', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }

}