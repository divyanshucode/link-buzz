import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Link as LinkType } from '@prisma/client';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Sparkles, Users } from 'lucide-react';
import ShareProfile from './ShareProfile';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  
  const user = await prisma.user.findUnique({
    where: { username },
    include: { links: true },
  });

  if (!user) {
    return {
      title: 'User Not Found - Link-Buzz',
      description: 'The requested user profile could not be found.',
    };
  }

  return {
    title: `@${user.username} - Link-Buzz`,
    description: `Check out @${user.username}'s Link-Buzz profile with ${user.links.length} links. Join Link-Buzz to create your own profile.`,
    openGraph: {
      title: `@${user.username} - Link-Buzz`,
      description: `Check out @${user.username}'s Link-Buzz profile with ${user.links.length} links.`,
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `@${user.username} - Link-Buzz`,
      description: `Check out @${user.username}'s Link-Buzz profile with ${user.links.length} links.`,
    },
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // Fetch the user and their links from the database
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      links: true, // Also fetch all the links associated with this user
    },
  });

  // If no user is found with that username, show a 404 page
  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header Card */}
          <Card className="glass border-white/20 mb-8 overflow-hidden">
            <CardContent className="p-8 text-center">
              {/* Profile Avatar */}
              <div className="mb-6">
                <Avatar className="w-24 h-24 mx-auto border-4 border-white/30 shadow-xl">
                  <AvatarFallback className="text-2xl font-bold gradient-primary text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                  @{user.username}
                </h1>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Users className="w-4 h-4 mr-2" />
                  Link-Buzz Creator
                </Badge>
              </div>

              {/* Stats */}
              <div className="flex justify-center items-center gap-6 mb-6 text-white/80">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{user.links.length}</p>
                  <p className="text-sm">Links</p>
                </div>
                <Separator orientation="vertical" className="h-12 bg-white/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">∞</p>
                  <p className="text-sm">Possibilities</p>
                </div>
              </div>

              {/* Share Profile Component */}
              <ShareProfile username={user.username} />
            </CardContent>
          </Card>

          {/* Links Section */}
          <div className="space-y-4">
            {user.links.length > 0 ? (
              user.links.map((link: LinkType, index: number) => (
                <Card 
                  key={link.id} 
                  className="glass border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <CardContent className="p-0">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-6 text-center"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-12 h-12 gradient-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white text-lg group-hover:text-yellow-200 transition-colors">
                            {link.title}
                          </p>
                          <p className="text-white/60 text-sm truncate">
                            {link.url}
                          </p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                      </div>
                    </a>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="glass border-white/20">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white/80 text-lg mb-2">
                    No links yet!
                  </p>
                  <p className="text-white/60">
                    This creator is still setting up their profile.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Join Link-Buzz CTA */}
          <Card className="glass border-white/20 mt-12">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Create Your Own Link-Buzz
                </h3>
                <p className="text-white/80">
                  Join creators sharing their content in one beautiful place.
                </p>
              </div>
              
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/signup" className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started for Free
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
