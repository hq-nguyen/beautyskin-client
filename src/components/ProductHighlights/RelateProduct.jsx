import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../utils/StarRating';
import { getProductByCategory } from '../../apis/product';

const RelatedProducts = ({ categoryId, currentProductId }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!categoryId) return;
            
            try {
                setLoading(true);
                const response = await getProductByCategory(categoryId);
                
                // Filter out the current product and limit to 4 products
                const filteredProducts = response.data
                    .filter(product => product.id !== currentProductId)
                    .slice(0, 4);
                    
                setRelatedProducts(filteredProducts);
            } catch (err) {
                console.error('Error fetching related products:', err);
                setError('Không thể tải sản phẩm liên quan');
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [categoryId, currentProductId]);

    if (loading) {
        return (
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
                <div className="text-center py-6 text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
            {relatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {relatedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    Không có sản phẩm liên quan
                </div>
            )}
        </div>
    );
};

const ProductCard = ({ product }) => {
    const promotionValue = product.promotions && product.promotions.length > 0
        ? product.promotions[0].value
        : 10;
    
    const discountedPrice = promotionValue > 0
        ? Math.round(product.price * (1 - promotionValue / 100))
        : product.price;
        
    const formattedPrice = product.price?.toLocaleString() || "0";
    const formattedDiscountedPrice = discountedPrice.toLocaleString();
    const imageUrl = product.images && product.images.length > 0 
        ? product.images[0].url 
        : 'https://via.placeholder.com/300x300';

    return (
        <Link to={`/product/${product.id}`} className="group">
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-square overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x300';
                        }}
                    />
                    {promotionValue > 0 && (
                        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs">
                            -{promotionValue}%
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-gray-800 font-medium line-clamp-1 mb-1">{product.name}</h3>
                    <div className="flex items-center mb-2">
                        <StarRating rating={product.rating || 0} size="small" />
                        <span className="text-xs text-gray-500 ml-1">
                            ({product.reviewCount || 0})
                        </span>
                    </div>
                    <div className="flex items-center">
                        {promotionValue > 0 && (
                            <span className="text-gray-500 line-through text-sm mr-2">{formattedPrice} đ</span>
                        )}
                        <span className="text-primary font-bold">
                            {promotionValue > 0 ? formattedDiscountedPrice : formattedPrice} đ
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RelatedProducts;