import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        localStorage.setItem('skinTypeId', skinTypeId)
        
        const data = await getProductBySkinType(skinTypeId);
        
        const recommendedProducts = data && data.length > 0 
          ? data.sort((a, b) => new Date(b.createDateTime) - new Date(a.createDateTime)).slice(0, 5)
          : [];
        
        setProducts(recommendedProducts);
        console.log('Set products:', recommendedProducts);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải sản phẩm đề xuất. Vui lòng thử lại sau.');
        setLoading(false);
        console.error('Error fetching recommended products:', err);
      }
    };
  
    getRecommendedProducts();
  }, [skinType]);
  
  console.log('Products before render:', products);

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
  
  if (!products.length) return (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-indigo-700">Sản phẩm đề xuất cho {skinType}</h3>
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        Hiện chưa có sản phẩm đề xuất cho loại da này.
      </div>
    </div>
  );

  const formattedPrice = (price) => new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(price);

  const getPlainTextFromHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
      <div className="flex items-center mb-6">
        <h3 className="text-xl font-semibold text-indigo-700">Sản phẩm đề xuất cho {skinType}</h3>
        <div className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
          Top 5 sản phẩm phù hợp
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const productImage = product.images && product.images.length > 0 
            ? product.images[0].url 
            : '/images/products/placeholder.jpg';

          const shortDescription = product.description 
            ? getPlainTextFromHTML(product.description).substring(0, 100) + '...' 
            : 'Không có mô tả.';

          return (
            <div 
              key={product.id}
              className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
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
              
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-1">{product.name}</h4>
                <p className="text-gray-600 mb-3 text-sm line-clamp-2">{shortDescription}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.skinConcerns && product.skinConcerns.slice(0, 3).map(concern => (
                    <span key={concern.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {concern.name}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-[#EE1F5B]">
                    {formattedPrice(product.price)}
                  </span>
                  <Link 
                    to={`/product/${product.id}`}
                    className="bg-[#EE1F5B] text-white px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <Link 
          to={{
            pathname: '/shop',
            search: `?skinType=${encodeURIComponent(skinType)}`
          }}
          className="inline-block bg-white text-[#EE1F5B] border border-red-600 px-6 py-2 rounded-md hover:bg-indigo-50 transition-colors font-medium"
        >
          Khám phá thêm các sản phẩm khác
        </Link>
      </div>
    </div>
  );
};

export default ProductRecommendations;