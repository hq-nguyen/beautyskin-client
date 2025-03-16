import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { AiOutlineHeart } from 'react-icons/ai';
import { MdCompare } from 'react-icons/md';
import StarRating from '../utils/StarRating';
import { assets } from '../../assets/frontend_assets/assets';
import api, { fetchProductById } from '../../apis/product';
import { toast } from 'react-toastify';
import { addToCartWithQuantity } from '../../redux/features/cartSlice';
import { addToCompare } from '../../redux/features/compareSlice';
import { fetchProductFeedbacks } from '../../apis/feedback';

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const compareItems = useSelector(state => state.compare.items);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedTab, setSelectedTab] = useState('description');
    const [quantity, setQuantity] = useState(1);
    const [showPopup, setShowPopup] = useState(false);
    const [isFavoriting, setIsFavoriting] = useState(false);
    const [isInFavorites, setIsInFavorites] = useState(false);
    const [favoriteMessage, setFavoriteMessage] = useState(null);
    const [isInCompare, setIsInCompare] = useState(false);
    const [feedbackData, setFeedbackData] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await fetchProductById(id);
                setProduct(data);

                // fetch feedback data
                try {
                    const response = await fetchProductFeedbacks(id);
                    setFeedbackData(response);
                } catch (error) {
                    console.error('Error fetching feedback data:', error);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleImageNavigation = (direction) => {
        if (!product?.images?.length) return;

        if (direction === 'next') {
            setCurrentImageIndex(
                prev => prev === product.images.length - 1 ? 0 : prev + 1
            );
        } else {
            setCurrentImageIndex(
                prev => prev === 0 ? product.images.length - 1 : prev - 1
            );
        }
    };

    const handleAddFavorites = async () => {
        try {
            setIsFavoriting(true);
            setError(null);
            setFavoriteMessage(null);

            const response = await api.post(`favorites/addToFavorites/${id}`);

            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Không thể thêm vào danh sách yêu thích');
            }

            setIsInFavorites(true);
            setFavoriteMessage('Đã thêm vào danh sách yêu thích thành công!');
            setTimeout(() => setFavoriteMessage(null), 2000);

            console.log('Đã thêm vào danh sách yêu thích:', response.data);

        } catch (error) {
            // setFavoriteMessage('Lỗi khi thêm vào sản phẩm yêu thích');
            toast.error('Sản phẩm đã tồn tại trong danh sách yêu thích')
            setTimeout(() => setFavoriteMessage(null), 2000);
            console.error('Lỗi khi thêm vào sản phẩm yêu thích', error);
        } finally {
            setIsFavoriting(false);
        }
    };

    const handleAddToCart = () => {
        if (quantity > 3) {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 1500);
            return;
        } else if (product) {
            dispatch(addToCartWithQuantity({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.images?.[0]?.url || 'https://via.placeholder.com/80x80',
                description: product.description,
                originalPrice: product.price,
                promo: product.promotions?.[0]?.value || 0
            }));
        }
    };

    const handleAddToCompare = () => {
        if (product) {
            dispatch(addToCompare({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.url || 'https://via.placeholder.com/80x80',
                category: product.category?.name,
                skinTypes: product.skinTypes?.map(type => type.name) || [],
                skinConcerns: product.skinConcerns?.map(concern => concern.name) || [],
                promotionValue: product.promotions?.[0]?.value || 0,
                stock: product.stock
            }));
        }

        // Navigate to compare page if there are at least 2 products in the compare list
        if (compareItems.length >= 1) { // Already 1 item + adding current one = 2 items
            // Show toast notification
            toast.info('Đã có 2 sản phẩm trong danh sách so sánh. Xem so sánh!');

            // Optional: Navigate to compare page
            // Uncomment this if you want to navigate directly to compare page
            // setTimeout(() => navigate('/compare'), 1500);
        }
        navigate('/compare');
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    <p>Product not found</p>
                </div>
            </div>
        );
    }

    const formattedPrice = product.price?.toLocaleString() || "0";
    const imageUrls = product.images?.map(img => img.url) || [];
    const promotionValue = product.promotions && product.promotions.length > 0
        ? product.promotions[0].value
        : 0;
    const discountedPrice = promotionValue > 0
        ? Math.round(product.price * (1 - promotionValue / 100))
        : product.price;
    const formattedDiscountedPrice = discountedPrice.toLocaleString();
    const skinTypes = product.skinTypes?.map(type => type.name).join(', ') || '';
    const skinConcerns = product.skinConcerns?.map(concern => concern.name).join(', ') || '';
    const tags = product.tags?.map(tag => tag.name).join(', ') || '';

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm mb-8">
                <a href="/" className="text-gray-500 hover:text-primary">Trang chủ</a>
                <span className="text-gray-400">/</span>
                <a href="/shop" className="text-gray-500 hover:text-primary">
                    {product.category?.name || 'Danh mục'}
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Section - Image Gallery */}
                <div className="space-y-6">
                    <div className="relative aspect-square overflow-hidden rounded-lg border">
                        {imageUrls.length > 0 ? (
                            <img
                                src={imageUrls[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = assets.product_new_1;
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span>No image available</span>
                            </div>
                        )}

                        {imageUrls.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between">
                                <button
                                    onClick={() => handleImageNavigation("prev")}
                                    className="bg-white p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 hover:scale-110 duration-300 mx-2"
                                >
                                    <IoIosArrowBack size={20} />
                                </button>
                                <button
                                    onClick={() => handleImageNavigation("next")}
                                    className="bg-white p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 hover:scale-110 duration-300 mx-2"
                                >
                                    <IoIosArrowForward size={20} />
                                </button>
                            </div>
                        )}

                        {promotionValue > 0 && (
                            <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full">
                                -{promotionValue}%
                            </div>
                        )}
                    </div>

                    {imageUrls.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {imageUrls.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border ${currentImageIndex === index ? "ring-2 ring-primary" : "opacity-70"}`}
                                >
                                    <img
                                        src={img}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = assets.product_new_1;
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Section - Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

                        <div className="mt-2 flex items-center space-x-4">
                            <div className="flex">
                                <StarRating rating={feedbackData.length > 0
                                    ? feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length
                                    : 0} />
                                <span className="ml-2 text-sm text-gray-500">( {feedbackData.length} đánh giá)</span>
                            </div>
                            {product.stock > 0 ? (
                                <span className="text-green-600 text-sm">Còn hàng</span>
                            ) : (
                                <span className="text-red-600 text-sm">Hết hàng</span>
                            )}
                        </div>

                        <div className="mt-4 flex items-center">
                            {promotionValue > 0 && (
                                <span className="text-gray-500 line-through text-lg mr-4">{formattedPrice} đ</span>
                            )}
                            <span className="text-2xl font-bold text-primary">
                                {promotionValue > 0 ? formattedDiscountedPrice : formattedPrice} đ
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-b py-4">
                        <p className="text-gray-600 mb-2">
                            Thuộc danh mục: <span className="font-medium">{product.category?.name || 'N/A'}</span>
                        </p>
                        {skinTypes && (
                            <p className="text-gray-600 mb-2">
                                Phù hợp cho loại da: <span className="font-medium">{skinTypes}</span>
                            </p>
                        )}
                        {skinConcerns && (
                            <p className="text-gray-600 mb-2">
                                Dành cho mối quan tâm về: <span className="font-medium">{skinConcerns}</span>
                            </p>
                        )}
                        {tags && (
                            <p className="text-gray-600">
                                Tags: <span className="font-medium">{tags}</span>
                            </p>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            {/* Quantity selector... */}
                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">
                            <button
                                onClick={handleAddToCart}
                                className="w-48 bg-primary text-white py-3 rounded-md hover:opacity-90 transition-all"
                                disabled={product.stock <= 0}
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button
                                onClick={handleAddFavorites}
                                disabled={isFavoriting}
                                className={`p-3 border rounded-md transition-all ${isInFavorites
                                    ? 'bg-rose-500 text-white'
                                    : 'hover:bg-rose-500 hover:text-white'
                                    } ${isFavoriting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={isInFavorites ? "Đã trong danh sách yêu thích" : "Thêm vào yêu thích"}
                            >
                                <AiOutlineHeart size={24} />
                            </button>
                            <button
                                onClick={handleAddToCompare}
                                className={`flex items-center justify-center p-3 border rounded-md transition-all ${isInCompare
                                    ? 'bg-rose-500 text-white'
                                    : 'border-rose-500 hover:bg-rose-500 hover:text-white'
                                    }`}
                                title={isInCompare ? "Đã trong danh sách so sánh" : "Thêm vào so sánh"}
                            >
                                <MdCompare className="mr-2" size={20} /> So sánh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup notifications */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-md shadow-lg border border-red-300">
                        <p className="text-red-500 font-medium">Sản phẩm chỉ có thể thêm tối đa là 3</p>
                    </div>
                </div>
            )}
            {favoriteMessage && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className={`p-4 rounded-md shadow-lg border ${favoriteMessage.includes('Lỗi')
                        ? 'bg-red-100 border-red-300 text-red-700'
                        : 'bg-green-100 border-green-300 text-green-700'
                        }`}>
                        <p className="font-medium">{favoriteMessage}</p>
                    </div>
                </div>
            )}

            {/* Tabs Section */}
            <div className="mt-12 border-t pt-8">
                <div className="flex space-x-8 border-b">
                    {["description", "ingredients", "how to use", "feedback"].map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`pb-4 px-2 ${selectedTab === tab
                                    ? "border-b-2 border-primary text-primary font-medium"
                                    : "text-gray-500"
                                    }`}
                            >
                                {tab === "description" ? "Mô tả" :
                                    tab === "ingredients" ? "Thành phần" :
                                        tab === "how to use" ? "Hướng dẫn sử dụng" :
                                            "Đánh giá"}
                            </button>
                        )
                    )}
                </div>

                <div className="py-6">
                    {selectedTab === "description" && (
                        <div className="prose max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: product.description }} />
                            <div className="grid gap-4 mt-6">
                                {Object.entries({
                                    'Phù hợp cho loại da': skinTypes,
                                    'Dành cho mối quan tâm về': skinConcerns,
                                    'Kết cấu': product.forms?.map(form => form.name).join(', ') || '',
                                    'Ngày ra mắt': new Date(product.createDateTime).toLocaleDateString('vi-VN'),
                                    'Tags': tags
                                }).map(([key, value]) => (
                                    value && (
                                        <div key={key} className="py-2 border-b">
                                            <p><strong>{key}: </strong>{value}</p>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedTab === "ingredients" && (
                        <div className="prose max-w-none">
                            <h3 className="text-xl font-semibold mb-4">Thành phần</h3>
                            <p>{product.ingredient || "Không có thông tin thành phần."}</p>
                        </div>
                    )}
                    {selectedTab === "how to use" && (
                        <div className="prose max-w-none">
                            <h3 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng</h3>
                            <div dangerouslySetInnerHTML={{ __html: product.instruction || "Không có hướng dẫn sử dụng." }} />
                        </div>
                    )}
                    {selectedTab === "feedback" && (
                        <div className="prose max-w-none">
                            <h3 className="text-xl font-semibold mb-4">Đánh giá từ khách hàng</h3>

                            {feedbackData && feedbackData.length > 0 ? (
                                <div className="mt-6 space-y-6">
                                    {feedbackData.map((feedback, index) => (
                                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-gray-600 font-semibold">
                                                            {feedback.user?.fullName?.charAt(0) || "U"}
                                                        </span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="font-medium">{feedback.user?.fullName || "Người dùng"}</p>
                                                        <div className="flex items-center mt-1">
                                                            <StarRating rating={feedback.rating || 5} />
                                                            <p className="text-xs text-gray-500 ml-2">
                                                                {new Date(feedback.feedBackDate || Date.now()).toLocaleDateString('vi-VN')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="mt-3 text-gray-600">{feedback.comment || "Không có nhận xét."}</p>
                                            {feedback.image && feedback.image !== "deo co hinh" && feedback.image !== "" && (
                                                <div className="mt-3">
                                                    <img
                                                        src={feedback.image}
                                                        alt="Feedback"
                                                        className="max-h-40 rounded-md object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
                                </div>
                            )}

                            {/* Add rating summary if needed */}
                            <div className="mt-8 border-t pt-6">
                                <h4 className="text-lg font-semibold mb-4">Tóm tắt đánh giá</h4>
                                <div className="flex items-center mb-4">
                                    <div className="text-3xl font-bold mr-2">
                                        {feedbackData.length > 0
                                            ? (feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length).toFixed(1)
                                            : "0.0"}
                                    </div>
                                    <div>
                                        <StarRating rating={feedbackData.length > 0
                                            ? feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length
                                            : 0} />
                                        <div className="text-sm text-gray-500 mt-1">
                                            {feedbackData.length} đánh giá
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div className="text-center py-12 text-gray-500">
                        Không có sản phẩm liên quan
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;