import Feed from './components/Feed';
import { mockPosts } from './data/mockPosts';

export default function Home() {
  return (
    <main className="min-h-screen bg-app-bg">
      <div className="container mx-auto px-4 py-8">
        <Feed initialPosts={mockPosts} />
      </div>
    </main>
  );
}
