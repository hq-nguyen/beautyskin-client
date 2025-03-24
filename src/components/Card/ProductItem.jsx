import { Link } from 'react-router-dom';
import { FaEye, FaHeart } from 'react-icons/fa';
import StarRating from '../utils/StarRating';
import { assets } from '../../assets/frontend_assets/assets';
import api from '../../config/axios';
import { useState, useEffect } from 'react';
import { fetchProductFeedbacks } from '../../apis/feedback';
import { createPortal } from 'react-dom';

const FavoriteMessage = ({ message, type }) => {
    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className={`p-4 rounded-md shadow-lg border max-w-xs w-full text-center ${type === 'error' ? 'bg-red-100 border-red-300 text-red-700' : 'bg-green-100 border-green-300 text-green-700'
                }`}>
                <p className="font-medium">{message}</p>
            </div>
        </div>,
        document.body
    );
};

const ProductItem = ({ id, image, promotion, name, oldPrice, newPrice }) => {
    const [isFavoriting, setIsFavoriting] = useState(false);
    const [isInFavorites, setIsInFavorites] = useState(false);
    const [favoriteMessage, setFavoriteMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const [feedbackSummary, setFeedbackSummary] = useState({ count: 0, averageRating: 0 });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const formattedOldPrice = oldPrice ? oldPrice.toLocaleString() : '0';
    const formattedNewPrice = newPrice ? newPrice.toLocaleString() : '0';
    const displayPromotion = promotion && promotion > 0;



    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        const getFeedbackSummary = async () => {
            const cachedData = sessionStorage.getItem(`product_feedback_${id}`);

            if (cachedData) {
                setFeedbackSummary(JSON.parse(cachedData));
                return;
            }
            try {
                const feedbacks = await fetchProductFeedbacks(id);
                if (Array.isArray(feedbacks) && feedbacks.length > 0) {
                    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
                    const avgRating = totalRating / feedbacks.length;

                    const summaryData = {
                        count: feedbacks.length,
                        averageRating: avgRating || 0
                    };
                    sessionStorage.setItem(`product_feedback_${id}`, JSON.stringify(summaryData));
                    setFeedbackSummary(summaryData);
                } else {
                    setFeedbackSummary({
                        count: 0,
                        averageRating: 0
                    });
                    sessionStorage.setItem(`product_feedback_${id}`, JSON.stringify({ count: 0, averageRating: 0 }));
                }
            } catch (error) {
                console.error("Error fetching feedback summary:", error);
            }
        };

        getFeedbackSummary();
    }, [id]);

    // Check if product is already in favorites
    useEffect(() => {
        if (!isLoggedIn) return;
        const checkFavoriteStatus = async () => {
            try {
                const response = await api.get('favorites/getFavorites');
                if (response.data && Array.isArray(response.data.products)) {
                    const isInList = response.data.products.some(product => product.id === id);
                    setIsInFavorites(isInList);
                }
            } catch (error) {
                console.error("Error checking favorite status:", error);
            }
        };

        checkFavoriteStatus();
    }, [id, isLoggedIn]);

    const showMessage = (msg, type = 'success') => {
        setFavoriteMessage(msg);
        setMessageType(type);
        setTimeout(() => setFavoriteMessage(null), 1000);
    };

    const handleAddFavorites = async () => {
        if (!isLoggedIn) {
            showMessage('Vui lòng đăng nhập để thêm sản phẩm vào yêu thích', 'error');
            return;
        }

        if (isInFavorites) {
            showMessage('Sản phẩm đã có trong danh sách yêu thích!', 'error');
            return;
        }

        try {
            setIsFavoriting(true);
            
            const response = await api.post(`favorites/addToFavorites/${id}`);

            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Không thể thêm vào danh sách yêu thích');
            }

            setIsInFavorites(true);
            showMessage('Đã thêm vào danh sách yêu thích thành công!');
            console.log('Đã thêm vào danh sách yêu thích:', response.data);
        } catch (error) {
            showMessage('Sản phẩm đã tồn tại trong danh sách yêu thích', 'error');
            console.error('Lỗi khi thêm vào sản phẩm yêu thích', error);
        } finally {
            setIsFavoriting(false);
        }
    };
    return (
        <div className="relative flex flex-col bg-white p-2 pb-8 hover:border hover:border-rose-500 transition-transform duration-150">
            <Link
                className="relative h-60 group block hover:scale-95 transition-transform duration-300"
                to={`/product/${id}`}
            >
                {displayPromotion && (
                    <div className="absolute top-2 left-2 bg-primary font-semibold text-white text-xs px-2 py-1 rounded">
                        -{promotion}%
                    </div>
                )}
                <img
                    src={image}
                    alt={name}
                    className="w-full h-48 object-contain mt-6"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = assets.product_new_1;
                    }}
                />
            </Link>
            <div className="mt-2">
                <Link to={`/product/${id}`}>
                    <h3 className="text-sm font-semibold text-gray-600 hover:text-pink-600 line-clamp-2 min-h-[40px]">
                        {name}
                    </h3>
                </Link>
                <div className="flex my-1">
                    <StarRating rating={(feedbackSummary.averageRating).toFixed(1)} />
                    <span className="ml-2 text-xs text-gray-500">({feedbackSummary.count})</span>
                </div>
                <div className="flex items-center">
                    <span className="text-xs text-gray-500 line-through">{formattedOldPrice} đ</span>
                    <span className="ml-2 text-base font-semibold text-primary">{formattedNewPrice} đ</span>
                </div>
                <div className="flex space-x-2 mt-2">
                    <Link to={`/product/${id}`}
                        className="flex-1 bg-primary text-white py-2 rounded-md transition-colors duration-300 hover:opacity-80 flex items-center justify-center space-x-1"
                    >
                        <FaEye className="w-4 h-4" />
                        <span>Xem nhanh</span>
                    </Link>
                    <button
                        onClick={handleAddFavorites}
                        disabled={isFavoriting}
                        className={`bg-gray-100 p-2 rounded-md transition-colors duration-300 hover:opacity-90 ${isFavoriting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        <FaHeart className={`w-4 h-4 ${isInFavorites ? "text-red-500" : "text-gray-500 hover:text-red-500"}`} />
                    </button>
                </div>
            </div>

            {/* Popup notification for favorite messages */}
            {favoriteMessage && (
                <FavoriteMessage message={favoriteMessage} type={messageType} />
            )}
        </div>
    );
};

export default ProductItem;