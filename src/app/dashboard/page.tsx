import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { JWTPayload } from '@/types/auth';
import LinkManager from './LinkManager';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import ProfileEditModal from './ProfileEditModal';

import { 
  ExternalLink, 
  Eye, 
  LogOut, 
  BarChart3,
  Users,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  let userId;
  try {
    const payload = verify(token, JWT_SECRET) as JWTPayload;
    userId = payload.userId;
  } catch {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <Card className="gradient-card border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center space-x-4 mb-6 lg:mb-0">
                  <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                    <AvatarFallback className="text-xl font-bold gradient-primary text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">
                      Welcome back, {user.username}!
                    </h1>
                    <p className="text-gray-600 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Manage your Link-Buzz profile
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button asChild variant="outline" className="w-full sm:w-auto border-purple-200 text-purple-600 hover:bg-purple-50">
                    <Link href={`/${user.username}`} target="_blank" className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                  <ProfileEditModal initialUsername={user.username} />
                  <Button asChild variant="outline" className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50">
                    <Link href="/api/logout" className="flex items-center">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Links</p>
                  <p className="text-3xl font-bold text-gray-900">{user.links.length}</p>
                </div>
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-3xl font-bold text-gray-900">∞</p>
                </div>
                <div className="w-12 h-12 gradient-secondary rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement</p>
                  <p className="text-3xl font-bold text-gray-900">High</p>
                </div>
                <div className="w-12 h-12 gradient-accent rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Links Management Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Manage Your Links</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="p-6">
            <LinkManager initialLinks={user.links} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
