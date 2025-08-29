import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, User, LayoutDashboard } from 'lucide-react';

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
  } catch {
    isLoggedIn = false;
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo with modern styling */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Link-Buzz
                </h1>
                <p className="text-xs text-gray-500 -mt-1">All links, one place</p>
              </div>
            </Link>
            
            {/* Beta badge */}
            <Badge variant="secondary" className="hidden md:inline-flex bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 text-xs">
              Beta
            </Badge>
          </div>
          
          {/* Navigation buttons with modern styling */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isLoggedIn ? (
              <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2">
                <Link href="/dashboard" className="flex items-center space-x-1 sm:space-x-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Dashboard</span>
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2">
                  <Link href="/login" className="flex items-center space-x-1 sm:space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Login</span>
                  </Link>
                </Button>
                <Button asChild className="gradient-primary text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all px-3 sm:px-4 py-2">
                  <Link href="/signup" className="flex items-center space-x-1 sm:space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Get Started</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}