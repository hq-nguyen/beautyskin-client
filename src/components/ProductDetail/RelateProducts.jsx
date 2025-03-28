import { useState, useEffect } from 'react';
import { getProductByCategory } from '../../apis/product';
import ProductItem from '../Card/ProductItem';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RelatedProducts = ({ categoryId, currentProductId }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!categoryId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getProductByCategory(categoryId);

                // Check if response is valid and contains data
                if (response) {
                    // Filter out the current product and limit to 7 products
                    const filteredProducts = response
                        .filter(product => product.id !== currentProductId && product.deleted !== true)
                        .slice(0, 7);

                    setRelatedProducts(filteredProducts);
                    console.log('API filteredProducts:', filteredProducts);
                } else {
                    // Handle case where response doesn't contain expected data
                    setRelatedProducts([]);
                }
            } catch (err) {
                console.error('Error fetching related products:', err);
                setError('Không thể tải sản phẩm liên quan');
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [categoryId, currentProductId]);

    // Custom arrow components for the slider
    const SlickArrow = ({ direction, onClick }) => (
        <button
            className={`absolute z-10 top-1/2 transform -translate-y-1/2 ${direction === 'prev' ? 'left-0' : 'right-0'
                } bg-white rounded-full shadow-md p-2 hover:bg-gray-100 focus:outline-none`}
            onClick={onClick}
        >
            {direction === 'prev' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            )}
        </button>
    );

    // Slider settings
    const settings = {
        dots: false,
        infinite: relatedProducts.length > 4,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: <SlickArrow direction="prev" />,
        nextArrow: <SlickArrow direction="next" />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

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
        <div className="mt-12 relative shadow-sm bg-white p-2">
            <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan với danh mục</h2>
            {relatedProducts.length > 0 ? (
                <div className="relative px-6">
                    <Slider {...settings}>
                        {relatedProducts.map(product => {
                            // Extract promotion value
                            const promotionValue = product.promotions && product.promotions.length > 0
                                ? product.promotions[0].value
                                : 10;

                            // Calculate new price if there's a promotion
                            const newPrice = promotionValue > 0
                                ? Math.round(product.price * (1 - promotionValue / 100))
                                : product.price;

                            // Get image URL
                            const imageUrl = product.images && product.images.length > 0
                                ? product.images[0].url
                                : 'https://via.placeholder.com/300x300';

                            return (
                                <div key={product.id} className="px-2">
                                    <ProductItem
                                        id={product.id}
                                        image={imageUrl}
                                        promotion={promotionValue}
                                        name={product.name}
                                        oldPrice={product.price}
                                        newPrice={newPrice}
                                        averageRating={product.averageRating}
                                        productSold={product.productSold}
                                    />
                                </div>
                            );
                        })}
                    </Slider>
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    Không có sản phẩm liên quan
                </div>
            )}
        </div>
    );
};

export default RelatedProducts;