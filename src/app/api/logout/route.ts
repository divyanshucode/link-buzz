

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request){
    (await cookies()).delete('auth_token');

    const loginUrl = new URL('/login', request.url);

    return NextResponse.redirect(loginUrl);
}