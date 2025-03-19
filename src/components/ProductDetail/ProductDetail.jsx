import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../../apis/product';
import { fetchProductFeedbacks } from '../../apis/feedback';
import StarRating from '../utils/StarRating';

// Import the new components
import ProductImageGallery from './ProductImageGallery';
import ProductTabs from './ProductTabs';
import ProductActions from './ProductActions';
import RelatedProducts from './RelateProducts';
// import RelatedProducts from './RelatedProducts';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedbackData, setFeedbackData] = useState([]);

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

    const navigateToCompare = () => {
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
    const promotionValue = product.promotions && product.promotions.length > 0
        ? product.promotions[0].value
        : 0;
    const discountedPrice = promotionValue > 0
        ? Math.round(product.price * (1 - promotionValue / 100))
        : product.price;
    const formattedDiscountedPrice = discountedPrice.toLocaleString();
    const averageRating = feedbackData.length > 0
        ? feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length
        : 0;

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
                <ProductImageGallery 
                    images={product.images} 
                    promotionValue={promotionValue} 
                />

                {/* Right Section - Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

                        <div className="mt-2 flex items-center space-x-4">
                            <div className="flex">
                                <StarRating rating={(averageRating).toFixed(1)} />
                                <span className="ml-2 text-sm text-gray-500">({feedbackData.length} đánh giá)</span>
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
                        {product.skinTypes?.length > 0 && (
                            <p className="text-gray-600 mb-2">
                                Phù hợp cho loại da: <span className="font-medium">
                                    {product.skinTypes.map(type => type.name).join(', ')}
                                </span>
                            </p>
                        )}
                        {product.skinConcerns?.length > 0 && (
                            <p className="text-gray-600 mb-2">
                                Dành cho mối quan tâm về: <span className="font-medium">
                                    {product.skinConcerns.map(concern => concern.name).join(', ')}
                                </span>
                            </p>
                        )}
                        {product.brand && (
                            <p className="text-gray-600 mb-2">
                                Thương hiệu: <span className="font-medium">{product.brand.name}</span>
                            </p>
                        )}
                        {product.forms?.length > 0 && (
                            <p className="text-gray-600">
                                Kết cấu: <span className="font-medium">
                                    {product.forms.map(form => form.name).join(', ')}
                                </span>
                            </p>
                        )}
                    </div>

                    {/* Product Actions Component */}
                    <ProductActions 
                        product={product} 
                        navigateToCompare={navigateToCompare} 
                    />
                </div>
            </div>

            {/* Product Tabs (Description, Ingredients, How to Use, Feedback) */}
            <ProductTabs 
                product={product} 
                feedbackData={feedbackData} 
            />

            {/* Related Products */}
            {product.category && (
                <RelatedProducts 
                    categoryId={product.category.id} 
                    currentProductId={product.id} 
                />
            )}
        </div>
    );
};

export default ProductDetail;