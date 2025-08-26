import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import LinkManager from './LinkManager';
import Link from 'next/link'; // Make sure Link is imported
import { Button } from '@/components/ui/button'; // Make sure Button is imported

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  let userId;
  try {
    const payload: any = verify(token, JWT_SECRET);
    userId = payload.userId;
  } catch (err) {
    redirect('/login');
  }

  if (!userId) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      links: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">
              Welcome, <span className="font-semibold">{user.username}</span>!
            </p>
          </div>
          {/* --- THIS IS THE NEW PART --- */}
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
              <Link href={`/${user.username}`} target="_blank">
                View My Profile
              </Link>
            </Button>
            <Button asChild>
              <a href="/api/logout">Logout</a>
            </Button>
          </div>
        </header>

        <main>
          <LinkManager initialLinks={user.links} />
        </main>
      </div>
    </div>
  );
}