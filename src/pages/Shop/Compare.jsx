import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { removeFromCompare, clearCompare } from '../../redux/features/compareSlice';

const ComparePage = () => {
    const dispatch = useDispatch();
    const compareItems = useSelector(state => state.compare.items);

    // Handle removing a product from compare
    const handleRemoveFromCompare = (productId) => {
        dispatch(removeFromCompare(productId));
    };

    // Handle clearing all products from compare
    const handleClearCompare = () => {
        dispatch(clearCompare());
    };

    // If there are less than 2 products, show a message
    if (compareItems.length < 2) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-6">So sánh sản phẩm</h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Vui lòng thêm ít nhất 2 sản phẩm để so sánh.
                    </p>
                    <Link to="/shop" className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:opacity-90">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">So sánh sản phẩm</h1>
                <button
                    onClick={handleClearCompare}
                    className="text-red-500 hover:text-red-700"
                >
                    Xóa tất cả
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-4 bg-gray-100 w-1/4">Thông tin</th>
                            {compareItems.map(item => (
                                <th key={item.id} className="border p-4 bg-gray-100 relative">
                                    <button
                                        onClick={() => handleRemoveFromCompare(item.id)}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Product Image Row */}
                        <tr>
                            <td className="border p-4 font-medium">Hình ảnh</td>
                            {compareItems.map(item => (
                                <td key={item.id} className="border p-4 text-center">
                                    <Link to={`/product/${item.id}`}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-32 h-32 object-contain mx-auto"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/150';
                                            }}
                                        />
                                    </Link>
                                </td>
                            ))}
                        </tr>

                        {/* Product Name Row */}
                        <tr>
                            <td className="border p-4 font-medium">Tên sản phẩm</td>
                            {compareItems.map(item => (
                                <td key={item.id} className="border p-4 text-center">
                                    <Link to={`/product/${item.id}`} className="text-primary hover:underline">
                                        {item.name}
                                    </Link>
                                </td>
                            ))}
                        </tr>

                        {/* Price Row */}
                        <tr>
                            <td className="border p-4 font-medium">Giá</td>
                            {compareItems.map(item => {
                                const discountedPrice = item.promotionValue > 0
                                    ? Math.round(item.price * (1 - item.promotionValue / 100))
                                    : item.price;
                                
                                return (
                                    <td key={item.id} className="border p-4 text-center">
                                        {item.promotionValue > 0 && (
                                            <span className="block line-through text-gray-500">
                                                {item.price.toLocaleString()} đ
                                            </span>
                                        )}
                                        <span className="font-bold text-primary">
                                            {discountedPrice.toLocaleString()} đ
                                        </span>
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Category Row */}
                        <tr>
                            <td className="border p-4 font-medium">Danh mục</td>
                            {compareItems.map(item => (
                                <td key={item.id} className="border p-4 text-center">
                                    {item.category || 'N/A'}
                                </td>
                            ))}
                        </tr>

                        {/* Skin Types Row */}
                        <tr>
                            <td className="border p-4 font-medium">Loại da</td>
                            {compareItems.map(item => (
                                <td key={item.id} className="border p-4 text-center">
                                    {item.skinTypes?.length > 0
                                        ? item.skinTypes.join(', ')
                                        : 'N/A'
                                    }
                                </td>
                            ))}
                        </tr>

                        {/* Skin Concerns Row */}
                        <tr>
                            <td className="border p-4 font-medium">Mối quan tâm về da</td>
                            {compareItems.map(item => (
                                <td key={item.id} className="border p-4 text-center">
                                    {item.skinConcerns?.length > 0
                                        ? item.skinConcerns.join(', ')
                                        : 'N/A'
                                    }
                                </td>
                            ))}
                        </tr>

                        {/* Availability Row */}
                        <tr>
                            <td className="border p-4 font-medium">Tình trạng</td>
                            {compareItems.map(item => (
                                <td key={item.id} className="border p-4 text-center">
                                    {item.stock > 0 ? (
                                        <span className="text-green-600">Còn hàng</span>
                                    ) : (
                                        <span className="text-red-600">Hết hàng</span>
                                    )}
                                </td>
                            ))}
                        </tr>

                        {/* Add to Cart Row */}
                        <tr>
                            <td className="border p-4 font-medium">Thao tác</td>
                            {compareItems.map(item => (
                                <td key={item.id} className="border p-4 text-center">
                                    <Link
                                        to={`/product/${item.id}`}
                                        className="inline-block bg-primary text-white px-4 py-2 rounded hover:opacity-90 mr-2"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparePage;