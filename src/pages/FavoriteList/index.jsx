import React, { useState, useEffect } from 'react';
import { Heart, HeartOff, Trash2, Star, X } from 'lucide-react';
import api from '../../config/axios';

const FavoriteProducts = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchFavoriteProducts();
  }, []);

  const fetchFavoriteProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites');
      console.log(response);
      
      if (response.status != 200) {
        throw new Error('Không thể lấy danh sách sản phẩm yêu thích');
      }
      
      setFavoriteProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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

  const toggleFavorite = async (id) => {
    try {
      const product = favoriteProducts.find(p => p.id === id);
      const newFavoriteStatus = !product.isFavorite;
      
      const response = await fetch(`/api/favorites/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isFavorite: newFavoriteStatus })
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật trạng thái yêu thích');
      }

      setFavoriteProducts(favoriteProducts.map(product => 
        product.id === id ? {...product, isFavorite: newFavoriteStatus} : product
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const ConfirmModal = () => {
    if (!showConfirmModal || !productToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium">Xác nhận xóa</h3>
            <button 
              onClick={cancelDelete}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 flex-shrink-0">
                <img 
                  src={productToDelete.image} 
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">Danh Sách Sản Phẩm Yêu Thích</h1>
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <HeartOff className="w-16 h-16 mx-auto text-gray-400" />
            <p className="text-xl text-gray-500 mt-4">Bạn chưa có sản phẩm yêu thích nào</p>
            <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover hover:text-rose-600"
                  />
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    {product.isFavorite ? (
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    ) : (
                      <Heart className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 hover:text-rose-600">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    {renderStars(product.rating)}
                    <span className="ml-2 text-sm text-gray-600">{product.rating?.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold hover:text-rose-600">{formatPrice(product.price)}</span>
                    <button 
                      onClick={() => confirmDelete(product)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Render modal xác nhận */}
      <ConfirmModal />
    </div>
  );
};

export default FavoriteProducts;