import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { fetchBlogs } from '../../apis/blog';
import BlogCard from '../../components/Card/BlogCard';
import LatestPostsSidebar from '../../components/Sidebar/LatestPostsSidebar';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Đang tải blog...</div>;
  }

  return (
    <div className="container mx-auto my-8 py-8 flex flex-col lg:flex-row">
      <main className='lg:w-4/5 pr-4 mb-6 lg:mb-0'>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Chưa có bài viết nào .</p>
        )}
      </main>

      {/* Vertical Line Divider */}
      <div className="hidden lg:block w-px bg-gray-200 mx-6"></div>

      <aside className='lg:w-1/5 sticky top-0'>
        <h2 className='text-2xl font-bold mb-4'>Bài viết mới nhất</h2>
        <hr className='bg-black w-[20%] h-[3px] mb-4' />
        <LatestPostsSidebar />
      </aside>


    </div>
  );
};

export default Blog;
