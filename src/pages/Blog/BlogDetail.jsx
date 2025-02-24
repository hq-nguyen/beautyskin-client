import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import api from '../../config/axios';
import api from '../../apis/blog';
import LatestPostsSidebar from '../../components/Sidebar/LatestPostsSidebar';

const BlogDetail = () => {
    const { slug } = useParams();
    // console.log(slug);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/Blog/?slug=${slug}`);
                // const response = await api.get(`/blog/get?slug=${slug}`);
                if (response.data && response.data.length > 0) {
                    setPost(response.data[0]);
                } else {
                    setError('Post not found');
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(err.message || "Failed to fetch post");
            } finally {
                setLoading(false);
            }

        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return <div className="text-center py-8">Loading post...</div>;
    }

    if (error) {
        return <div className="text-red-500 py-8">{error}</div>;
    }

    if (!post) {
        return <div className="text-center py-8">Post not found.</div>;
    }

    const { title, publish, author, image, content, tag } = post;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return date.toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row min-h-screen">
            {/* Main Content (80% width on large screens, full width on small screens) */}
            <main className="lg:w-4/5 pr-4 mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
                <p className="text-gray-600 mb-4">Ngày đăng: {formatDate(publish)}</p>
                <p className="text-gray-600 mb-4">Tags: {tag}</p>
                {/* <p className='mb-4'>Tác giả: {author}</p> */}

                <img src={image} alt={title} className="w-full rounded-lg mb-6" />

                <div className="blog-content text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
            </main>

            {/* Vertical Line Divider */}
            <div className="hidden lg:block w-px bg-gray-200 mx-6"></div>

            <aside className="lg:w-1/5 sticky top-4 flow-root ">
                <h2 className="text-xl font-semibold mb-4">Bài viết mới nhất</h2>
                <hr className='bg-black w-[20%] h-[3px] mb-4' />
                <LatestPostsSidebar />
            </aside>
        </div>
    );
};

export default BlogDetail;
