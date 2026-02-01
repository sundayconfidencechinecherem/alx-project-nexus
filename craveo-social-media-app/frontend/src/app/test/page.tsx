'use client';

import { useState } from 'react';
import { useAddComment, useGetComments, useCurrentUser } from '@/app/hooks/useGraphQL';

export default function TestCommentsPage() {
  const [postId, setPostId] = useState('697b4b3a616012d8fe8f87f3');
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const { user } = useCurrentUser();
  const { addComment } = useAddComment();
  const { comments, refetch } = useGetComments(postId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || loading) return;
    
    setLoading(true);
    try {
      const response = await addComment(postId, commentText);
      console.log('Full response:', response);
      setResult(response);
      setCommentText('');
      
      // Refresh comments after 1 second
      setTimeout(() => {
        refetch();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error:', error);
      console.error('GraphQL Errors:', error.graphQLErrors);
      console.error('Network Error:', error.networkError);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Comments</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Current User:</h2>
        <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block mb-2">Post ID:</label>
          <input
            type="text"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Comment:</label>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Enter your comment..."
          />
        </div>
        
        <button
          type="submit"
          disabled={!commentText.trim() || loading}
          className={`px-4 py-2 rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Comments ({comments.length})</h2>
        <div className="space-y-4">
          {comments.map((comment: any) => (
            <div key={comment.id} className="p-4 border rounded">
              <div className="flex items-center mb-2">
                <div className="font-semibold">{comment.author?.username || 'Unknown'}</div>
                <div className="text-sm text-gray-500 ml-2">
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
              </div>
              <p>{comment.content}</p>
              <div className="text-xs text-gray-500 mt-1">ID: {comment.id}</div>
            </div>
          ))}
        </div>
      </div>
      
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Last Result:</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      
      <div className="mt-6">
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Refresh Comments
        </button>
      </div>
    </div>
  );
}