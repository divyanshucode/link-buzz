'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Copy, Share2 } from 'lucide-react'; // Using lucide-react for icons

// SVG Icon for WhatsApp
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

// SVG Icon for X (Twitter)
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);


export default function ShareProfile({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/${username}` : '';
  const shareText = encodeURIComponent(`Check out this Link-Buzz profile: ${shareUrl}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-gray-200 shadow-xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            <span>Share Profile</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Profile URL</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <Input 
                  id="link" 
                  defaultValue={shareUrl} 
                  readOnly 
                  className="bg-gray-50 border-gray-200 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button 
                onClick={handleCopy} 
                size="sm" 
                className={`px-4 transition-all duration-200 ${
                  copied 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? (
                  <span className="text-xs font-medium">Copied!</span>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Share on Social Media</label>
            <div className="flex items-center justify-center space-x-3">
              <Button 
                asChild 
                variant="outline" 
                size="sm"
                className="border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200"
              >
                <a 
                  href={`https://wa.me/?text=${shareText}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Share on WhatsApp"
                  className="flex items-center space-x-2 px-4 py-2"
                >
                  <WhatsAppIcon />
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="sm"
                className="border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <a 
                  href={`https://twitter.com/intent/tweet?text=${shareText}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Share on X"
                  className="flex items-center space-x-2 px-4 py-2"
                >
                  <XIcon />
                  <span className="text-sm font-medium">X (Twitter)</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
