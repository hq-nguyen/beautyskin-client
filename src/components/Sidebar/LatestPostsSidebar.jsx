import { useState, useEffect } from 'react';
import { fetchBlogsIsFalse } from '../../apis/blog';
import { Link } from 'react-router-dom';

const LatestPostsSidebar = () => {
    const [latestPosts, setLatestPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                const posts = await fetchBlogsIsFalse();

                const sortedPosts = posts.sort((a, b) => new Date(b.publish) - new Date(a.publish));

                setLatestPosts(sortedPosts.slice(0, 3));
            } catch (err) {
                console.error("Error fetching latest posts:", err);
                setError(err.message || "Failed to fetch latest posts");
            } finally {
                setLoading(false);
            }
        };

        fetchLatestPosts();
    }, []); // Ensure this only runs once by keeping the dependency array empty

    if (loading) {
        return <div>Loading latest posts...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <ul>
                {latestPosts.map((post) => (
                    <li key={post.id} className="mb-2">
                        <Link to={`/blog/${post.slug}`} className="text-black hover:underline">
                            {post.title}
                        </Link>
                        <hr className='mt-2'/>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LatestPostsSidebar;
