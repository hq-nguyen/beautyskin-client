import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiStar, FiX } from 'react-icons/fi';
import { removeFromCompare, clearCompare } from '../../redux/features/compareSlice';
import { useEffect, useState } from 'react';
import { getSkinProfile } from '../../apis/customer';

const AddProductButton = () => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-full min-h-[200px]">
        <Link to="/shop" className="flex flex-col items-center">
            <div className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center mb-2">
                <FiPlus size={24} className="text-gray-400" />
            </div>
            <span className="text-gray-600">Thêm sản phẩm</span>
        </Link>
    </div>
);

const ComparePage = () => {
    const dispatch = useDispatch();
    const compareItems = useSelector(state => state.compare.items);
    const [userSkinType, setUserSkinType] = useState(null);
    console.log('compareItems', compareItems);
    

    useEffect(() => {
        const fetchUserSkinProfile = async () => {
            try {
                const userId = localStorage.getItem('id');
                if (!userId) return;

                const skinData = await getSkinProfile(userId);
                if (skinData && skinData.skinType) {
                    setUserSkinType(skinData.skinType.name);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin da người dùng:", error);
            }
        };
        fetchUserSkinProfile();
    }, []);

    const handleRemoveFromCompare = (productId) => {
        dispatch(removeFromCompare(productId));
    };

    const handleClearCompare = () => {
        dispatch(clearCompare());
    };

    const isProductMatchSkinType = (productSkinTypes) => {
        if (!userSkinType || !productSkinTypes) return false;
        if (productSkinTypes[0] && typeof productSkinTypes[0] === 'object') {
            return productSkinTypes.some(skinType => skinType.name === userSkinType);
        }
        return productSkinTypes.includes(userSkinType);
    };

    if (compareItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-6">So sánh sản phẩm</h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Vui lòng thêm ít nhất 2 sản phẩm để so sánh.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        <AddProductButton />
                        <AddProductButton />
                        <AddProductButton />
                    </div>
                </div>
            </div>
        );
    }

    if (compareItems.length === 1) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">So sánh sản phẩm</h1>
                    <Link
                        to="/shop"
                        className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:opacity-90 flex items-center"
                    >
                        <FiPlus className="mr-2" /> Thêm sản phẩm
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 relative">
                        <button
                            onClick={() => handleRemoveFromCompare(compareItems[0].id)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                        >
                            <FiX size={20} />
                        </button>
                        <Link to={`/product/${compareItems[0].id}`}>
                            <img
                                src={compareItems[0].image}
                                alt={compareItems[0].name}
                                className="w-full h-48 object-contain mb-4"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/150';
                                }}
                            />
                            <h2 className="text-lg font-semibold text-center mb-2">{compareItems[0].name}</h2>
                            <div className="text-center">
                                {compareItems[0].promotionValue > 0 && (
                                    <span className="block text-gray-500 line-through">
                                        {compareItems[0].price.toLocaleString()} đ
                                    </span>
                                )}
                                <span className="font-bold text-primary">
                                    {(compareItems[0].promotionValue > 0
                                        ? Math.round(compareItems[0].price * (1 - compareItems[0].promotionValue / 100))
                                        : compareItems[0].price
                                    ).toLocaleString()} đ
                                </span>
                            </div>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <AddProductButton />
                        <AddProductButton />
                    </div>
                </div>
            </div>
        );
    }

    if (compareItems.length >= 2) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">So sánh sản phẩm</h1>
                    {compareItems.length < 3 && (
                        <Link
                            to="/shop"
                            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:opacity-90 flex items-center"
                        >
                            <FiPlus className="mr-2" /> Thêm sản phẩm
                        </Link>
                    )}
                    {compareItems.length > 2 && (
                        <button
                            onClick={handleClearCompare}
                            className="text-red-500 hover:text-red-700"
                        >
                            Xóa tất cả
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {compareItems.map(item => (
                            <div key={item.id}
                                className={`border rounded-lg p-4 relative ${isProductMatchSkinType(item.skinTypes)
                                    ? 'border-primary border-2'
                                    : ''
                                    }`}
                            >
                                {isProductMatchSkinType(item.skinTypes) && (
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                        Phù hợp với da của bạn
                                    </div>
                                )}
                                <button
                                    onClick={() => handleRemoveFromCompare(item.id)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                >
                                    <FiX size={20} />
                                </button>
                                <Link to={`/product/${item.id}`}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-48 object-contain mb-4"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/150';
                                        }}
                                    />
                                    <h2 className="text-lg font-semibold text-center mb-2">{item.name}</h2>
                                    <div className="text-center">
                                        {item.promotionValue > 0 && (
                                            <span className="block text-gray-500 line-through">
                                                {item.price.toLocaleString()} đ
                                            </span>
                                        )}
                                        <span className="font-bold text-primary">
                                            {(item.promotionValue > 0
                                                ? Math.round(item.price * (1 - item.promotionValue / 100))
                                                : item.price
                                            ).toLocaleString()} đ
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        {compareItems.length < 3 && <AddProductButton />}
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border p-4 bg-gray-100 w-1/4">Thông tin</th>
                                {compareItems.map(item => (
                                    <th key={item.id} className="border p-4 bg-gray-100">Sản phẩm </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
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

                            <tr>
                                <td className="border p-4 font-medium">Danh mục</td>
                                {compareItems.map(item => (
                                    <td key={item.id} className="border p-4 text-center">
                                        {item.category || 'N/A'}
                                    </td>
                                ))}
                            </tr>

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
                    {userSkinType && (
                        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
                            <p className="text-lg">
                                Loại da của bạn: <span className="font-bold text-primary">{userSkinType}</span>
                            </p>
                            <p className="text-gray-600 mt-2">
                                Các sản phẩm được đánh dấu <span className="text-green-600 font-semibold">xanh</span> phù hợp với loại da của bạn
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
};

export default ComparePage;