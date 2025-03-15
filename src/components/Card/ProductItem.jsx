import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaEye, FaHeart } from 'react-icons/fa';
import StarRating from '../utils/StarRating';
import { assets } from '../../assets/frontend_assets/assets';
import api from '../../config/axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ProductItem = ({ id, image, promotion, name, rating, oldPrice, newPrice }) => {
    const [isFavoriting, setIsFavoriting] = useState(false);
    const [isInFavorites, setIsInFavorites] = useState(false);
    const [error, setError] = useState(null);
    const [favoriteMessage, setFavoriteMessage] = useState(null); // Added favoriteMessage state

    const formattedOldPrice = oldPrice ? oldPrice.toLocaleString() : '0';
    const formattedNewPrice = newPrice ? newPrice.toLocaleString() : '0';
    
    const displayPromotion = promotion && promotion > 0;

    const handleAddFavorites = async () => {
        if (isInFavorites) {
            // If already in favorites, show a message and do nothing
            setFavoriteMessage('Sản phẩm đã có trong danh sách yêu thích!');
            setTimeout(() => setFavoriteMessage(null), 2000);
            return;
        }

        try {
            setIsFavoriting(true);
            setError(null);
            setFavoriteMessage(null);

            const response = await api.post(`favorites/addToFavorites/${id}`);
            
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Không thể thêm vào danh sách yêu thích');
            }

            setIsInFavorites(true);
            setFavoriteMessage('Đã thêm vào danh sách yêu thích thành công!'); // Success message
            setTimeout(() => setFavoriteMessage(null), 2000); // Clear message after 2 seconds
            
            console.log('Đã thêm vào danh sách yêu thích:', response.data);
        } catch (error) {
            setFavoriteMessage('Sản phẩm đã tồn tại trong danh sách yêu thích'); // Error message
            setTimeout(() => setFavoriteMessage(null), 2000); // Clear message after 2 seconds
            console.error('Lỗi khi thêm vào sản phẩm yêu thích', error);
            // Optionally keep toast.error if you want both popup and toast notifications
            toast.error('Sản phẩm đã tồn tại trong danh sách yêu thích');
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
                    <StarRating rating={rating} />
                    <span className="ml-2 text-xs text-gray-500">(10)</span>
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
                        className={`bg-gray-100 p-2 rounded-md transition-colors duration-300 hover:opacity-90 ${
                            isFavoriting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        <FaHeart className={`w-4 h-4 ${isInFavorites ? "text-red-500" : "hover:text-red-500"}`} />
                    </button>
                </div>
                {error && (
                    <div className="text-xs text-red-500 mt-1">{error}</div>
                )}
            </div>

            {/* Popup notification for favorite messages */}
            {favoriteMessage && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className={`p-4 rounded-md shadow-lg border ${
                        favoriteMessage.includes('Lỗi') || favoriteMessage.includes('tồn tại') || favoriteMessage.includes('đã có')
                            ? 'bg-red-100 border-red-300 text-red-700'
                            : 'bg-green-100 border-green-300 text-green-700'
                    }`}>
                        <p className="font-medium">{favoriteMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

ProductItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string.isRequired,
    promotion: PropTypes.number,
    name: PropTypes.string.isRequired,
    rating: PropTypes.number,
    oldPrice: PropTypes.number.isRequired,
    newPrice: PropTypes.number
};

export default ProductItem;