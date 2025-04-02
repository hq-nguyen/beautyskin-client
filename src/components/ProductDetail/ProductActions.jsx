import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHeart } from 'react-icons/ai';
import { MdCompare } from 'react-icons/md';
import api from '../../apis/product';
import { addToCartWithQuantity, clearCart } from '../../redux/features/cartSlice';
import { addToCompare } from '../../redux/features/compareSlice';

const ProductActions = ({ product, navigateToCompare }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState(null);
    const [isFavoriting, setIsFavoriting] = useState(false);
    const [isInFavorites, setIsInFavorites] = useState(false);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0) { // Now allowing any positive value
            setQuantity(value);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 600);
    };

    const handleAddFavorites = async () => {
        try {
            setIsFavoriting(true);

            const response = await api.post(`favorites/addToFavorites/${product.id}`);

            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Không thể thêm vào danh sách yêu thích');
            }

            setIsInFavorites(true);
            showNotification('Đã thêm vào danh sách yêu thích thành công!', 'success');

        } catch (error) {
            showNotification('Sản phẩm đã tồn tại trong danh sách yêu thích', 'error');
            console.error('Lỗi khi thêm vào sản phẩm yêu thích', error);
        } finally {
            setIsFavoriting(false);
        }
    };

    const handleAddToCart = () => {
        if (quantity > product.stock) {
            showNotification(`Chỉ còn ${product.stock} sản phẩm trong kho`, 'error');
            return;
        } else if (quantity > 3) {
            showNotification('Sản phẩm chỉ có thể thêm tối đa là 3', 'error');
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
                promo: product.promotions?.[0]?.value || 0,
                maxStock: product.stock
            }));
            showNotification('Đã thêm sản phẩm vào giỏ hàng', 'success');
        }
    };

    const handleBuyNow = () => {
        if (quantity > product.stock) {
            showNotification(`Chỉ còn ${product.stock} sản phẩm trong kho`, 'error');
            return;
        } else if (quantity > 3) {
            showNotification('Sản phẩm chỉ có thể thêm tối đa là 3', 'error');
            return;
        } else if (product) {
            // Clear the current cart first
            dispatch(clearCart());
            
            // Add this product to cart
            dispatch(addToCartWithQuantity({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.images?.[0]?.url || 'https://via.placeholder.com/80x80',
                description: product.description,
                originalPrice: product.price,
                promo: product.promotions?.[0]?.value || 0,
                maxStock: product.stock
            }));
            
            // Navigate to checkout page
            navigate('/checkout');
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
                stock: product.stock,
                productSold: product?.productSold || 0,
                averageRating: product?.averageRating || 0,
            }));
            showNotification('Đã thêm sản phẩm vào so sánh', 'success');
        }

        navigateToCompare();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    <label htmlFor="quantity" className="text-gray-700 mr-3">Số lượng:</label>
                    <div className="flex items-center border rounded-md">
                        <button
                            onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                            className="px-3 py-2 border-r hover:bg-gray-100"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="w-12 text-center py-2 border-none focus:outline-none"
                        />
                        <button
                            onClick={() => setQuantity(q => q + 1)}
                            className="px-3 py-2 border-l hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>
                </div>
                <p className="text-sm text-gray-500">
                    {product.stock > 0 ? `` : 'Hết hàng'}
                </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
                <button
                    onClick={handleAddToCart}
                    className={`w-36 md:w-40 bg-primary text-white py-3 rounded-md transition-all ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                        }`}
                    disabled={product.stock <= 0}
                >
                    Thêm vào giỏ hàng
                </button>
                <button
                    onClick={handleBuyNow}
                    className={`w-36 md:w-40 bg-rose-600 text-white py-3 rounded-md transition-all ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                        }`}
                    disabled={product.stock <= 0}
                >
                    Mua ngay
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
                    className="flex items-center justify-center p-3 border rounded-md transition-all hover:bg-rose-500 hover:text-white"
                    title="Thêm vào so sánh"
                >
                    <MdCompare className="mr-2" size={20} /> So sánh
                </button>
            </div>

            {/* Centered Notification */}
            {notification && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className={`p-4 rounded-md shadow-lg border animate-fade-in ${notification.type === 'success'
                            ? 'bg-green-100 border-green-300 text-green-700'
                            : 'bg-red-100 border-red-300 text-red-700'
                        }`}>
                        <p className="font-medium">{notification.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductActions;