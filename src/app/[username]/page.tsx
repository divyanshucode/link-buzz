import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Link } from '@prisma/client'; 

// This is a dynamic Server Component
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
      <div className="max-w-xl mx-auto px-4">
        {/* Profile Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
            <span className="text-gray-500">Avatar</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">@{user.username}</h1>
        </div>

        {/* Links List */}
        <div className="space-y-4">
          {user.links.length > 0 ? (
            user.links.map((link: Link) => (
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
      </div>
    </div>
  );
}