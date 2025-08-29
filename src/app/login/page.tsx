// src/app/login/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from 'jsonwebtoken';
import LoginForm from './LoginForm'; 

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token) {
    try {
      verify(token, JWT_SECRET);
      // If token is valid, redirect to dashboard
      redirect('/dashboard');
    } catch {
      // If token is invalid, just continue to show the login form
    }
  }

  return <LoginForm />;
}