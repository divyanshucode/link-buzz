import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-800">
        All Your Links,
        <br />
        <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
          In One Place.
        </span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-gray-600">
        Create a single, beautiful link to share everything you are. Perfect for
        your social media bios, portfolios, and more.
      </p>
      <div className="mt-8">
        <Button asChild size="lg">
          <Link href="/signup">Get Started for Free</Link>
        </Button>
      </div>
    </div>
  );
}