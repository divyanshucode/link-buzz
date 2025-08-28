import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Link as LinkType } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ShareProfile from './ShareProfile'; // Import the ShareProfile component

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;

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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-xl mx-auto px-4 flex flex-col items-center">
        {/* Profile Info */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
            {/* Placeholder for an avatar image */}
            <span className="text-gray-500">Avatar</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">@{user.username}</h1>
        </div>

        {/* Share Profile Component */}
        <div className="mb-8">
          <ShareProfile username={user.username} />
        </div>

        {/* Links List */}
        <div className="space-y-4 w-full">
          {user.links.length > 0 ? (
            user.links.map((link: LinkType) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white p-4 text-center rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                <p className="font-semibold text-gray-700">{link.title}</p>
              </a>
            ))
          ) : (
            <p className="text-center text-gray-500">
              This user hasn't added any links yet.
            </p>
          )}
        </div>

        {/* Join Link-Buzz Button */}
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/signup">
              Join Link-Buzz 🐝
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
