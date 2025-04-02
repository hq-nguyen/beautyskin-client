import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../apis/blog';
import LatestPostsSidebar from '../../components/Sidebar/LatestPostsSidebar';
import { formatDate } from '../../utils/format';
import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';

const BlogDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/blog/getByDeleteIsFalse?slug=${slug}`);
                if (response.data && response.data.length > 0) {
                    // Ensure you're getting the correct post based on the slug
                    const post = response.data.find((item) => item.slug === slug);
                    if (post) {
                        setPost(post);
                    } else {
                        setError('Không tìm thấy bài viết.');
                    }
                } else {
                    setError('Không tìm thấy bài viết.');
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(err.message || "Failed to fetch post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]); // Update the dependency array to include slug

    if (loading) {
        return <div className="text-center py-8">Đang tải bài viết...</div>;
    }

    if (error) {
        return <div className="text-red-500 py-8">{error}</div>;
    }

    if (!post) {
        return <div className="text-center py-8">Không tìm thấy bài viết.</div>;
    }

    const handleFacebookShare = () => {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    const handleInstagramShare = () => {
        // Mở ứng dụng Instagram trên thiết bị di động hoặc trang chủ Instagram trên web
        window.open('https://www.instagram.com/', '_blank');
    };

    const { title, publish, image, content } = post;

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row min-h-screen">
            {/* Main Content */}
            <main className="lg:w-4/5 pr-4 mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
                <div className="flex items-center mb-4">
                    <p className="text-gray-600 mr-4">Ngày đăng: {formatDate(publish)}</p>
                    <div className="w-px h-6 bg-gray-200 mx-4"></div>
                    <button onClick={handleFacebookShare} className="mr-2">
                        <FacebookOutlined />
                    </button>
                    <button onClick={handleInstagramShare}>
                        <InstagramOutlined />
                    </button>
                </div>
                <hr className="mb-8" />
                <img src={image} alt={title} className="w-full rounded-lg mb-6" />

                <div className="blog-content text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
            </main>

            {/* Vertical Line Divider */}
            <div className="hidden lg:block w-px bg-gray-200 mx-6"></div>

            <aside className="lg:w-1/5 sticky top-4 flow-root ">
                <div className='sticky top-32'>
                    <h2 className="text-xl font-semibold mb-4">Bài viết mới nhất</h2>
                    <hr className='bg-black w-[20%] h-[3px] mb-4' />
                    <LatestPostsSidebar />
                </div>
            </aside>
        </div>
    );
};

export default BlogDetail;
