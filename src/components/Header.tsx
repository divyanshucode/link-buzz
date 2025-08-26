import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  let isLoggedIn = false;
  try {
    if (token) {
      verify(token, JWT_SECRET);
      isLoggedIn = true;
    }
  } catch (error) {
    isLoggedIn = false;
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container with justify-between for extreme positioning */}
        <div className="flex items-center justify-between h-16">
          {/* Logo on the extreme left */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              Link-Buzz 🐝
            </Link>
          </div>
          
          {/* Buttons on the extreme right */}
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <Button asChild variant="ghost">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild>
                  <a href="/api/logout">Logout</a>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}