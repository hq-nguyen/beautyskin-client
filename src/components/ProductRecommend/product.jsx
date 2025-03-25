import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductBySkinType, mapSkinTypeToId } from '../../apis/product';

const ProductRecommendations = ({ skinType }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRecommendedProduct = async () => {
      if (!skinType) return;
      
      try {
        setLoading(true);
        const skinTypeId = mapSkinTypeToId(skinType);
        
        const data = await getProductBySkinType(skinTypeId);
        
        const latestProduct = data && data.length > 0 
          ? data.sort((a, b) => new Date(b.createDateTime) - new Date(a.createDateTime))[0]
          : null;
        
        setProduct(latestProduct);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải sản phẩm đề xuất. Vui lòng thử lại sau.');
        setLoading(false);
        console.error('Error fetching recommended product:', err);
      }
    };

    getRecommendedProduct();
  }, [skinType]);

  if (loading) return (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-indigo-700">Sản phẩm đề xuất cho {skinType}</h3>
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-indigo-700">Sản phẩm đề xuất cho {skinType}</h3>
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-indigo-700">Sản phẩm đề xuất cho {skinType}</h3>
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        Hiện chưa có sản phẩm đề xuất cho loại da này.
      </div>
    </div>
  );

  const productImage = product.images && product.images.length > 0 
    ? product.images[0].url 
    : '/images/products/placeholder.jpg';

  const formattedPrice = new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(product.price);

  const getPlainTextFromHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const shortDescription = product.description ? 
    getPlainTextFromHTML(product.description).substring(0, 120) + '...' : 
    'Không có mô tả.';

  return (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <h3 className="text-xl font-semibold text-indigo-700">Sản phẩm đề xuất cho {skinType}</h3>
        <div className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
          Phù hợp nhất
        </div>
      </div>
      
      <div className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div className="md:flex">
          <div className="md:w-1/3 h-64 md:h-auto bg-gray-100 flex items-center justify-center overflow-hidden">
            <img 
              src={productImage}
              alt={product.name} 
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/images/products/placeholder.jpg';
              }}
            />
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h4 className="font-semibold text-xl mb-2 text-gray-800">{product.name}</h4>
                <p className="text-gray-600 mb-4">{shortDescription}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.skinConcerns && product.skinConcerns.map(concern => (
                    <span key={concern.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {concern.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
                <span className="font-bold text-xl text-indigo-700">
                  {formattedPrice}
                </span>
                <Link 
                  to={`/product/${product.id}`} 
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors w-full sm:w-auto text-center"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-6">
        <Link 
          to={{
            pathname: '/shop',
            search: `?skinType=${encodeURIComponent(skinType)}`
          }}
          className="inline-block bg-white text-indigo-600 border border-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-50 transition-colors font-medium"
        >
          Khám phá thêm các sản phẩm khác
        </Link>
      </div>
    </div>
  );
};

export default ProductRecommendations;