import { useState } from "react";
import { FaHeart, FaEye, FaStar } from "react-icons/fa";
import { assets } from "../../assets/frontend_assets/assets";
import { Link } from "react-router-dom";

const ProductHighlights = () => {
  const [activeTab, setActiveTab] = useState("hotDeals");

  const hotDealsProducts = [
    { id: 1, name: "Premium Wireless", image: assets.product_new_1, rating: 4.5, newPrice: 199.99, oldPrice: 299.99, discount: 33 },
    { id: 2, name: "Premium Wireless Headphones", image: assets.product_new_2, rating: 4.5, newPrice: 199.99, oldPrice: 299.99, discount: 33 },
    { id: 3, name: "Premium Wireless Headphones", image: assets.product_new_3, rating: 4.5, newPrice: 199.99, oldPrice: 299.99, discount: 33 },
    { id: 4, name: "Premium Wireless Headphones", image: assets.product_new_4, rating: 4.5, newPrice: 199.99, oldPrice: 299.99, discount: 33 },
    { id: 5, name: "Premium Wireless Headphones", image: assets.product_new_5, rating: 4.5, newPrice: 199.99, oldPrice: 299.99, discount: 33 },
  ];

  const newProducts = [
    { id: 6, name: "Smart Home Hub", image: assets.product_new_1, rating: 4.3, newPrice: 159.99, oldPrice: 199.99, discount: 20 },
    { id: 7, name: "Premium Wireless Headphones", image: assets.da_dau, rating: 4.5, newPrice: 199.99, oldPrice: 299.99, discount: 33 },
    { id: 8, name: "Premium Wireless Headphones", image: assets.da_kho, rating: 4.5, newPrice: 199.99, oldPrice: 299.99, discount: 33 },
    { id: 9, name: "Premium Wireless Headphones", image: assets.da_thuong, rating: 4.5, newPrice: 199.99, oldPrice: 299.99, discount: 33 },
    { id: 10, name: "Premium Wireless Headphones", image: assets.da_tonghop, rating: 4.5, newPrice: 199.99, oldPrice: 299.99, discount: 33 },
  ];

  const products = activeTab === "hotDeals" ? hotDealsProducts.slice(0, 5) : newProducts.slice(0, 5);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`w-3 h-3 ${index < Math.floor(rating) ? "text-primary" : "text-gray-300"
          }`}
      />
    ));
  };


  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-white rounded-lg shadow-lg mt-24 relative">
      {/* Tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-6 py-2 rounded-xl transition-colors duration-300 ${activeTab === "hotDeals" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("hotDeals")}
          >
            Bán chạy
          </button>
          <button
            className={`px-6 py-2 rounded-xl transition-colors duration-300 ${activeTab === "newProducts" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("newProducts")}
          >
            Sản phẩm mới
          </button>
        </div>
        {/* Button for large screens */}
        <Link to="/product" className="hidden lg:block">
          <button className="text-sm font-semibold px-4 py-2 bg-gray-600 text-white rounded-full shadow hover:bg-pink-600 transition-colors duration-300">
            Xem tất cả sản phẩm
          </button>
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 p-[10px] md:p-[20px] lg:p-[30px]">
        {products.map((product) => (
          <div key={product.id} className="relative flex flex-col bg-white p-4 pb-8 hover:shadow transition-transform duration-300">
            <a href="" className="relative h-60 group hover:scale-95 transition-transform duration-300">
              <div className="absolute top-2 left-2 bg-primary font-semibold text-white text-xs px-2 py-1 rounded">
                -{product.discount}%
              </div>
              <img src={product.image} alt={product.name} className="w-full object-cover h-48 mt-12" />
            </a>
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-600 hover:text-pink-600 truncate">{product.name}</h3>
              <div className="flex my-2">
                {renderStars(product.rating)}
                <span className="ml-2 text-xs text-gray-500">(10)</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 line-through">${product.oldPrice}</span>
                <span className="ml-2 text-base font-semibold text-primary">${product.newPrice}</span>
              </div>

              <div className="flex space-x-2 mt-8">
                <button
                  className="flex-1 bg-primary text-white py-2 rounded-md transition-colors duration-300 hover:opacity-80 flex items-center justify-center space-x-1"
                >
                  <FaEye className="w-4 h-4" />
                  <span>Xem nhanh</span>
                </button>
                <button
                  className="bg-gray-100 p-2 rounded-md transition-colors duration-300 hover:opacity-90"
                >
                  <FaHeart className="w-4 h-4 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button for small screens */}
      <div className="lg:hidden flex justify-center mt-8">
        <Link to="/product">
          <button className="text-sm font-semibold px-4 py-2 bg-gray-600 text-white rounded-full shadow hover:bg-pink-600 transition-colors duration-300">
            Xem tất cả sản phẩm
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductHighlights;
