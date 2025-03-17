import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { mapSkinTypeToId } from '../../apis/products';
import { getProductBySkinType, mapSkinTypeToId } from '../../apis/product';

const ProductRecommendations = ({ skinType }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRecommendedProducts = async () => {
      if (!skinType) return;
      
      try {
        setLoading(true);
        const skinTypeId = mapSkinTypeToId(skinType);
        
        const data = await getProductBySkinType(skinTypeId);
        
        setProducts(data || []);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải sản phẩm đề xuất. Vui lòng thử lại sau.');
        setLoading(false);
        console.error('Error fetching recommended products:', err);
      }
    };

    getRecommendedProducts();
  }, [skinType]);

  if (loading) return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Sản phẩm đề xuất cho {skinType}</h3>
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Sản phẩm đề xuất cho {skinType}</h3>
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    </div>
  );
  
  if (!products.length) return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Sản phẩm đề xuất cho {skinType}</h3>
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        Hiện chưa có sản phẩm đề xuất cho loại da này.
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Sản phẩm đề xuất cho {skinType}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {product.thumbnail ? (
                <img 
                  src={product.thumbnail} 
                  alt={product.name} 
                  className="object-cover h-full w-full"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/images/products/placeholder.jpg';
                  }}
                />
              ) : (
                <div className="text-gray-400 text-center">Hình ảnh<br/>sản phẩm</div>
              )}
            </div>
            <div className="p-4">
              <h4 className="font-medium text-lg mb-1">{product.name}</h4>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="font-semibold text-lg">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </span>
                <Link 
                  to={`/product/${product.id}`} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <Link 
          to={`/products?skinType=${mapSkinTypeToId(skinType)}`}
          className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Xem tất cả sản phẩm cho {skinType}
        </Link>
      </div>
    </div>
  );
};

export default ProductRecommendations;