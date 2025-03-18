import { useState, useEffect } from 'react';
import { HeartOff, Trash2, X, CheckCircle } from 'lucide-react';
import api from '../../config/axios';
import { assets } from '../../assets/frontend_assets/assets';
import { addToCart } from '../../redux/features/cartSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';


const FavoriteProducts = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchFavoriteProducts();
  }, []);

  const fetchFavoriteProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites');
      console.log(response);

      if (response.status !== 200) {
        throw new Error('Không thể lấy danh sách sản phẩm yêu thích');
      }
      const sortedProducts = [...response.data].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        else if (a.favoriteId && b.favoriteId) {
          return b.favoriteId - a.favoriteId;
        }
        else {
          return b.id - a.id;
        }
      });

      setFavoriteProducts(sortedProducts);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = () => {
    if (favoriteProducts) {
      dispatch(addToCart({ ...favoriteProducts, quantity }));
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowConfirmModal(true);
  };

  const removeFromFavorites = async () => {
    try {
      if (!productToDelete) return;

      const response = await api.delete(`/favorites/removeFromFavorites/${productToDelete.id}`);

      if (response.status !== 200) {
        throw new Error('Không thể xóa sản phẩm khỏi danh sách yêu thích');
      }

      setFavoriteProducts(favoriteProducts.filter(product => product.id !== productToDelete.id));
      setShowConfirmModal(false);
      setProductToDelete(null);
    } catch (err) {
      setError(err.message);
      setShowConfirmModal(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setProductToDelete(null);
  };

  const ConfirmModal = () => {
    if (!showConfirmModal || !productToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium">Xác nhận xóa</h3>
            <button onClick={cancelDelete} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={productToDelete.images[0].url || assets.da_kho}
                  alt={productToDelete.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div>
                <p className="font-medium line-clamp-1">{productToDelete.name}</p>
                <p className="text-sm text-gray-500 mt-1">{formatPrice(productToDelete.price)}</p>
              </div>
            </div>

            <p className="mt-4 text-gray-600">
              Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích không?
            </p>
          </div>

          <div className="flex border-t p-4 bg-gray-50">
            <button
              onClick={cancelDelete}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={removeFromFavorites}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={fetchFavoriteProducts}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-4">
      <h1 className="text-xl font-bold p-4 border-b">Danh sách yêu thích <span className='font-normal'>({favoriteProducts.length} sản phẩm)</span></h1>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-16">
          <HeartOff className="w-16 h-16 mx-auto text-gray-400" />
          <p className="text-xl text-gray-500 mt-4">Bạn chưa có sản phẩm yêu thích nào</p>
          <button className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Khám phá sản phẩm
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-2 text-left text-sm font-medium text-gray-600">Sản phẩm</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Trạng thái</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">Đơn giá</th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {favoriteProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-4 px-2 w-5/12">
                    <div className="flex items-center space-x-3">
                      <Link to={`/product/${product.id}`} className="flex-shrink-0 w-12 h-12">
                        <img
                          src={product.images[0].url || assets.da_kho}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </Link>
                      <Link to={`/product/${product.id}`} className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 line-clamp-2 hover:text-rose-500">{product.name}</p>
                      </Link>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Còn hàng</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div>
                      <p className="text-sm font-bold text-orange-600">{formatPrice(product.salePrice || product.price)}</p>
                      {product.salePrice && (
                        <p className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => confirmDelete(product)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal />
    </div>
  );
};

export default FavoriteProducts;