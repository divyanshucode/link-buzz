'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Save, 
  X, 
  AlertTriangle,
  Link as LinkIcon
} from 'lucide-react';

type Link = {
  id: string;
  title: string;
  url: string;
};

export default function LinkManager({ initialLinks }: { initialLinks: Link[] }) {
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // State for editing a link
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // State to track which link is pending deletion
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  const handleAddSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newLinkTitle, url: newLinkUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create link');
      }

      setNewLinkTitle('');
      setNewLinkUrl('');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATED: This function now just sets the state to show the confirmation UI
  const handleDeleteClick = (linkId: string) => {
    setDeletingLinkId(linkId);
  };

  // NEW: This function runs the actual delete logic
  const confirmDelete = async () => {
    if (!deletingLinkId) return;
    await fetch(`/api/links/${deletingLinkId}`, { method: 'DELETE' });
    setDeletingLinkId(null); // Reset the state
    router.refresh();
  };

  const handleEditClick = (link: Link) => {
    setEditingLink(link);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingLink) return;

    await fetch(`/api/links/${editingLink.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, url: editUrl }),
    });
    setEditingLink(null);
    router.refresh();
  };

  return (
    <div className="w-full space-y-6">
      {/* ADD NEW LINK FORM */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Plus className="w-5 h-5 mr-2" />
            Add New Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Link Title</label>
              <Input
                type="text"
                placeholder="My awesome website"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">URL</label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full gradient-primary text-white hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LIST OF LINKS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <LinkIcon className="w-5 h-5 mr-2" />
            Your Links
          </h3>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {initialLinks.length} {initialLinks.length === 1 ? 'link' : 'links'}
          </Badge>
        </div>
        
        {initialLinks.length > 0 ? (
          <div className="space-y-3">
            {initialLinks.map((link, index) => (
              <Card key={link.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {editingLink?.id === link.id ? (
                    // EDITING VIEW
                    <form onSubmit={handleUpdateSubmit} className="space-y-3">
                      <Input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="Link title"
                        required
                      />
                      <Input
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="https://example.com"
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" className="gradient-primary text-white">
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingLink(null)}
                          className="border-gray-300"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    // DEFAULT VIEW
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 gradient-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{link.title}</p>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block"
                          >
                            {link.url}
                          </a>
                        </div>
                      </div>

                      {deletingLinkId === link.id ? (
                        // CONFIRMATION VIEW
                        <div className="flex items-center gap-2 ml-4">
                          <p className="text-sm text-gray-600 whitespace-nowrap">Delete this link?</p>
                          <Button 
                            onClick={confirmDelete} 
                            size="sm" 
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Yes
                          </Button>
                          <Button 
                            onClick={() => setDeletingLinkId(null)} 
                            size="sm" 
                            variant="outline"
                            className="border-gray-300"
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        // ACTION BUTTONS VIEW
                        <div className="flex gap-2 ml-4">
                          <Button 
                            onClick={() => handleEditClick(link)} 
                            size="sm" 
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => handleDeleteClick(link.id)} 
                            size="sm" 
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No links yet!</p>
              <p className="text-gray-400">Add your first link to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
