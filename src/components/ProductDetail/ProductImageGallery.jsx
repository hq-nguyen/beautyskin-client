import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { assets } from '../../assets/frontend_assets/assets';

const ProductImageGallery = ({ images, promotionValue }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imageUrls = images?.map(img => img.url) || [];

    const handleImageNavigation = (direction) => {
        if (!imageUrls.length) return;

        if (direction === 'next') {
            setCurrentImageIndex(
                prev => prev === imageUrls.length - 1 ? 0 : prev + 1
            );
        } else {
            setCurrentImageIndex(
                prev => prev === 0 ? imageUrls.length - 1 : prev - 1
            );
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
                {imageUrls.length > 0 ? (
                    <img
                        src={imageUrls[currentImageIndex]}
                        alt="Product"
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
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-md">
                        -{promotionValue * 100}%
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
    );
};

export default ProductImageGallery;