import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { JWTPayload } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ linkId: string }> }
    //params : { linkId } is the ID of the link to delete we get from the URL
) {
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

        const { linkId } = await params;
        const link = await prisma.link.findUnique({ where: { id: linkId } });

        // Security Check: Ensure the user owns this link before deleting
        if (!link || link.userId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.link.delete({ where: { id: linkId } });

        return NextResponse.json({ message: 'Link deleted' }, { status: 200 });

    } catch (error) {
        console.error('DELETE_LINK_ERROR', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }

}

export async function PUT(request: Request, { params }: { params: Promise<{ linkId: string }> }) {
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

        const { linkId } = await params;
        const link = await prisma.link.findUnique({ where: { id: linkId } });

        // Security Check: Ensure the user owns this link before deleting
        if (!link || link.userId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { title, url } = await request.json();
        if (!title || !url) {
            return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
        }

        const updatedLink = await prisma.link.update({
            where: { id: linkId },
            data: { title, url },
        });

        return NextResponse.json(updatedLink, { status: 200 });


    } catch (error) {
        console.error('UPDATE_LINK_ERROR', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}