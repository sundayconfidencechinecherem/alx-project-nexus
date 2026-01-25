import Feed from './components/Feed';
import { mockPosts } from './data/mockPosts';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="min-h-screen bg-app-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Add Create Post Button */}
        <div className="mb-8 flex justify-end">
          <Link
            href="/create-post"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-lg"
          >
            <FaPlus />
            Create Post
          </Link>
        </div>
        
        <Feed initialPosts={mockPosts} />
      </div>
    </main>
  );
}
