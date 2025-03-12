import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { AiOutlineHeart } from 'react-icons/ai';
import { MdCompare } from 'react-icons/md';
import StarRating from '../utils/StarRating';
import { assets } from '../../assets/frontend_assets/assets';
import { fetchProductById } from '../../apis/product';
import { addToCartWithQuantity } from '../../redux/features/cartSlice';

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedTab, setSelectedTab] = useState('description');
    const [quantity, setQuantity] = useState(1);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await fetchProductById(id);
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleQuantityChange = (type) => {
        if (type === 'increment' && quantity < product.stock && quantity < 4) {
            setQuantity((prevQuantity) => prevQuantity + 1);
        } else if (type === 'decrement' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

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
                originalPrice: product.price, // Assuming no discount for simplicity
                promo: product.promotions?.[0]?.value || 0
            }));
        }
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

    // Format price with locale string
    const formattedPrice = product.price?.toLocaleString() || "0";

    // Create image URLs array
    const imageUrls = product.images?.map(img => img.url) || [];

    // Calculate any promotions
    const promotionValue = product.promotions && product.promotions.length > 0
        ? product.promotions[0].value
        : 0;

    const discountedPrice = promotionValue > 0
        ? Math.round(product.price * (1 - promotionValue / 100))
        : product.price;

    const formattedDiscountedPrice = discountedPrice.toLocaleString();

    // Extract skin types, concerns and tags as comma-separated strings
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
                {/* <span className="text-gray-400">/</span>
                <span className="text-primary">{product.name}</span> */}
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
                                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border ${currentImageIndex === index ? "ring-2 ring-primary" : "opacity-70"
                                        }`}
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
                                <StarRating rating={4.5} /> {/* You may replace with actual rating */}
                                <span className="ml-2 text-sm text-gray-500">(10 đánh giá)</span>
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
                        <div className="flex items-center space-x-2">
                            <span
                                className={`px-3 py-1 rounded-full text-sm ${product.stock > 10
                                    ? "bg-green-100 text-green-800"
                                    : product.stock > 0
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {product.stock > 0 ? `${product.stock} sản phẩm có sẵn` : 'Hết hàng'}
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Số lượng:</span>
                            <div className="flex items-center border rounded-md">
                                <button
                                    onClick={() => handleQuantityChange("decrement")}
                                    className="p-2 hover:bg-gray-100"
                                    disabled={product.stock <= 0}
                                >
                                    <FiMinus />
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value) && value > 0 && value <= Math.min(product.stock, 4)) {
                                            setQuantity(value);
                                        }
                                    }}
                                    className="w-16 text-center border-x"
                                    disabled={product.stock <= 0}
                                />
                                <button
                                    onClick={() => handleQuantityChange("increment")}
                                    className="p-2 hover:bg-gray-100"
                                    disabled={product.stock <= 0 || quantity >= Math.min(product.stock, 4)}
                                >
                                    <FiPlus />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">
                            <button
                                onClick={handleAddToCart}
                                className="w-48 bg-primary text-white py-3 rounded-md hover:opacity-90 transition-all"
                                disabled={product.stock <= 0}
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button className="p-3 border rounded-md hover:bg-gray-50 hover:text-white hover:bg-rose-500 transition-all">
                                <AiOutlineHeart size={24} />
                            </button>
                            <button className="flex items-center justify-center bg-white text-black p-3 border border-rose-500 rounded-md hover:bg-rose-500 hover:text-white transition-all">
                                <MdCompare className="mr-2" size={20} /> So sánh
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Popup notification */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-md shadow-lg border border-red-300">
                        <p className="text-red-500 font-medium">Sản phẩm chỉ có thể thêm tối đa là 3</p>
                    </div>
                </div>
            )}

            {/* Tabs Section */}
            <div className="mt-12 border-t pt-8">
                <div className="flex space-x-8 border-b">
                    {["description", "ingredients", "how to use"].map(
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
                                        "Hướng dẫn sử dụng"}
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
                                            <p>
                                                <strong>{key}: </strong>
                                                {value}
                                            </p>
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
                </div>
            </div>

            {/* Related Products Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* This would be populated with actual related products */}
                    <div className="text-center py-12 text-gray-500">
                        Không có sản phẩm liên quan
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;