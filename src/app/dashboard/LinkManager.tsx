'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  // NEW: State to track which link is pending deletion
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
    <div className="w-full">
      {/* ADD NEW LINK FORM */}
      <form onSubmit={handleAddSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2 text-gray-800">Add a New Link</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="mb-2">
          <input type="text" placeholder="Link Title" value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div className="mb-2">
          <input type="url" placeholder="https://example.com" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-gray-400">
          {isLoading ? 'Adding...' : 'Add Link'}
        </button>
      </form>

      {/* LIST OF LINKS */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-gray-800">Your Links</h3>
        {initialLinks.length > 0 ? (
          initialLinks.map((link) => (
            <div key={link.id} className="bg-white p-4 rounded-lg shadow-sm">
              {editingLink?.id === link.id ? (
                // EDITING VIEW
                <form onSubmit={handleUpdateSubmit}>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="shadow-sm border rounded w-full py-2 px-3 mb-2 text-gray-700" required />
                  <input type="url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} className="shadow-sm border rounded w-full py-2 px-3 mb-2 text-gray-700" required />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-500 text-white py-1 px-3 rounded">Save</button>
                    <button type="button" onClick={() => setEditingLink(null)} className="bg-gray-500 text-white py-1 px-3 rounded">Cancel</button>
                  </div>
                </form>
              ) : (
                // DEFAULT VIEW
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{link.title}</p>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">{link.url}</a>
                  </div>

                  {deletingLinkId === link.id ? (
                    // CONFIRMATION VIEW
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">Are you sure?</p>
                      <button onClick={confirmDelete} className="bg-red-600 text-white py-1 px-3 rounded">Yes</button>
                      <button onClick={() => setDeletingLinkId(null)} className="bg-gray-400 text-white py-1 px-3 rounded">No</button>
                    </div>
                  ) : (
                    // ACTION BUTTONS VIEW
                    <div className="flex gap-2">
                      <button onClick={() => handleEditClick(link)} className="bg-yellow-500 text-white py-1 px-3 rounded">Edit</button>
                      <button onClick={() => handleDeleteClick(link.id)} className="bg-red-500 text-white py-1 px-3 rounded">Delete</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">You haven't added any links yet.</p>
        )}
      </div>
    </div>
  );
}
