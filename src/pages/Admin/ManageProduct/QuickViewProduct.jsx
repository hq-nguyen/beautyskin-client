import { useState } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { AiOutlineHeart } from 'react-icons/ai';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';
import { MdCompare } from 'react-icons/md';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const QuickViewModal = ({ product, visible, onCancel }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedTab, setSelectedTab] = useState('description'); // Default to 'description'
    const [quantity, setQuantity] = useState(1);
    
    // Define capacities based on available forms if any
    const capacities = product?.forms?.map(form => form.name) || [];
    const [selectedCapacity, setSelectedCapacity] = useState(capacities[0] || '');

    const handleQuantityChange = (type) => {
        if (type === 'increment') {
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

    // Early return if product is null or undefined
    if (!product) {
        return null;
    }

    // Format price with locale string
    const formattedPrice = product.price?.toLocaleString() || "0";
    
    // Create image URLs array
    const imageUrls = product.images?.map(img => img.url) || [];

    // Extract skin types, concerns and tags as comma-separated strings
    const skinTypes = product.skinTypes?.map(type => type.name).join(', ') || '';
    const skinConcerns = product.skinConcerns?.map(concern => concern.name).join(', ') || '';
    const tags = product.tags?.map(tag => tag.name).join(', ') || '';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Modal
                title="Xem nhanh sản phẩm"
                open={visible}
                onCancel={onCancel}
                footer={null}
                width={800}
            >
                <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-6">
                        {/* Left Section - Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square overflow-hidden rounded-lg">
                                {imageUrls.length > 0 ? (
                                    <img
                                        src={imageUrls[currentImageIndex]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        No image available
                                    </div>
                                )}
                                {imageUrls.length > 1 && (
                                    <div className="absolute inset-0 flex items-center justify-between">
                                        <button
                                            onClick={() => handleImageNavigation("prev")}
                                            className="bg-white p-2 shadow-lg opacity-25 hover:opacity-100 hover:scale-110 duration-300"
                                        >
                                            <IoIosArrowBack />
                                        </button>
                                        <button
                                            onClick={() => handleImageNavigation("next")}
                                            className="bg-white p-2 shadow-lg opacity-25 hover:opacity-100 hover:scale-110 duration-300"
                                        >
                                            <IoIosArrowForward />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {imageUrls.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {imageUrls.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                                                currentImageIndex === index ? "ring-2 ring-primary" : "opacity-50"
                                            }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Section - Product Details */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                                <div className="mt-2 flex items-center space-x-2">
                                    <h3>{`${formattedPrice} đ`}</h3>
                                    {/* Removed hardcoded price since no discount info in data */}
                                </div>
                                {/* Removed rating display since it's not in the data */}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            product.stock > 10
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {product.stock} sản phẩm có sẵn
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border rounded-md">
                                        <button
                                            onClick={() => handleQuantityChange("decrement")}
                                            className="p-2 hover:bg-gray-100"
                                        >
                                            <FiMinus />
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            className="w-16 text-center border-x"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange("increment")}
                                            className="p-2 hover:bg-gray-100"
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>
                                </div>

                                {capacities.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {capacities.map((cap) => (
                                            <button
                                                key={cap}
                                                onClick={() => setSelectedCapacity(cap)}
                                                className={`px-4 py-2 rounded-md ${
                                                    selectedCapacity === cap
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                            >
                                                {cap}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 justify-between">
                                    <button className="w-32 grow bg-primary text-white rounded-md hover:opacity-90">
                                        Thêm vào giỏ hàng
                                    </button>
                                    <button className="p-3 border rounded-md hover:bg-gray-50 hover:text-white hover:bg-rose-500">
                                        <AiOutlineHeart size={20} />
                                    </button>
                                    <button className="w-32 grow flex items-center bg-white text-black p-3 border border-rose-500 rounded-md hover:bg-rose-500 hover:text-white duration-150">
                                        <MdCompare className="mr-4" size={20} /> Thêm vào so sánh
                                    </button>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <div className="flex space-x-4 border-b">
                                    {["description", "ingredients", "how to use"].map(
                                        (tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setSelectedTab(tab)}
                                                className={`pb-2 ${
                                                    selectedTab === tab
                                                        ? "border-b-2 border-primary text-primary"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                            </button>
                                        )
                                    )}
                                </div>

                                <div className="pt-4">
                                    {selectedTab === "description" && (
                                        <div className="grid gap-4">
                                            <p className='font-bold underline text-lg'>Mô tả:</p>
                                            <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                            <hr className='w-[40%] bg-black' />

                                            {Object.entries({
                                                'Phù hợp cho loại da': skinTypes,
                                                'Dành cho mối quan tâm về': skinConcerns,
                                                'Kết cấu': product.forms?.map(form => form.name).join(', ') || '',
                                                'Ngày ra mắt': new Date(product.createDateTime).toLocaleDateString('vi-VN'),
                                                'Tags': tags
                                            }).map(([key, value]) => (
                                                value && (
                                                    <div key={key}>
                                                        <p>
                                                            <strong>{key}: </strong>
                                                            {value}
                                                        </p>
                                                        <hr className='w-[40%] bg-black' />
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}

                                    {selectedTab === "ingredients" && (
                                        <div>
                                            <p className="mb-4">{product.ingredient || "Không có thông tin thành phần."}</p>
                                        </div>
                                    )}

                                    {selectedTab === "how to use" && (
                                        <div dangerouslySetInnerHTML={{ __html: product.instruction || "Không có hướng dẫn sử dụng." }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

QuickViewModal.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        stock: PropTypes.number,
        createDateTime: PropTypes.string,
        lastUpdateDateTime: PropTypes.string,
        expiredDateTime: PropTypes.string,
        status: PropTypes.string,
        instruction: PropTypes.string,
        price: PropTypes.number,
        ingredient: PropTypes.string,
        skinTypes: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
                description: PropTypes.string,
                deleted: PropTypes.bool
            })
        ),
        skinConcerns: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
                description: PropTypes.string,
                deleted: PropTypes.bool
            })
        ),
        tags: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
                deleted: PropTypes.bool
            })
        ),
        forms: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
                description: PropTypes.string,
                deleted: PropTypes.bool
            })
        ),
        images: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                url: PropTypes.string,
                deleted: PropTypes.bool
            })
        ),
        deleted: PropTypes.bool
    }),
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default QuickViewModal;