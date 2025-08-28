import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Simple SVG icon components for social media
const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-600 hover:text-gray-900"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-600 hover:text-gray-900"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-600 hover:text-gray-900"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function HomePage() {
  return (
    // Main container
    <div className="flex flex-col min-h-[calc(100vh-4rem)] px-4">
      {/* Centered content */}
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-800">
          All Your Links,
          <br />
          <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
            In One Place.
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-600">
          Create a single, beautiful link to share everything you are. Perfect
          for your social media bios, portfolios, and more.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </div>
      </div>

      {/* Footer with social links */}
      <footer className="py-6 text-center">
        <div className="flex justify-center space-x-6">
          <a
            href="https://x.com/wake_up_div" // <-- Replace with your link
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X profile"
          >
            <XIcon />
          </a>
          <a
            href="https://linkedin.com/in/divyanshu-kanswal-738057261/" // <-- Replace with your link
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
          >
            <LinkedinIcon />
          </a>
          <a
            href="https://github.com/divyanshucode" // <-- Replace with your link
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
          >
            <GithubIcon />
          </a>
        </div>
      </footer>
    </div>
  );
}
