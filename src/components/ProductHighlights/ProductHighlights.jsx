import { useState, useCallback, useRef, useEffect } from "react";
import { FaHeart, FaEye, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { assets } from "../../assets/frontend_assets/assets";

const ProductHighlights = () => {
  const [activeTab, setActiveTab] = useState("hotDeals");
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef(null);

  const hotDealsProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      image: assets.product_new_1,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    },
    {
      id: 2,
      name: "Premium Wireless Headphones",
      image: assets.product_new_2,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    },
    {
      id: 3,
      name: "Premium Wireless Headphones",
      image: assets.product_new_3,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    },
    {
      id: 4,
      name: "Premium Wireless Headphones",
      image: assets.product_new_4,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    },
    {
      id: 5,
      name: "Premium Wireless Headphones",
      image: assets.product_new_5,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    },
    {
      id: 2,
      name: "Premium Wireless Headphones",
      image: assets.product_new_2,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    },
    {
      id: 5,
      name: "Premium Wireless Headphones",
      image: assets.product_new_5,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    },
    {
      id: 1,
      name: "Premium Wireless Headphones",
      image: assets.product_new_1,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    }
  ];

  const newProducts = [
    {
      id: 9,
      name: "Smart Home Hub",
      image: assets.product_new_1,
      rating: 4.3,
      newPrice: 159.99,
      oldPrice: 199.99,
      discount: 20,
    },
    {
      id: 10,
      name: "Premium Wireless Headphones",
      image: assets.da_dau,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    },
    {
      id: 3,
      name: "Premium Wireless Headphones",
      image: assets.da_kho,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    },
    {
      id: 4,
      name: "Premium Wireless Headphones",
      image: assets.da_thuong,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    },
    {
      id: 5,
      name: "Premium Wireless Headphones",
      image: assets.da_tonghop,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    },
    {
      id: 2,
      name: "Premium Wireless Headphones",
      image: assets.product_new_2,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    },
    {
      id: 5,
      name: "Premium Wireless Headphones",
      image: assets.product_new_5,
      rating: 4.5,
      newPrice: 199.99,
      oldPrice: 299.99,
      discount: 33,
    }
  ];


  const products = activeTab === "hotDeals" ? hotDealsProducts : newProducts;

  const handlePrevClick = useCallback(() => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  }, [])

  const handleNextClick = () => {
    setStartIndex((prev) => Math.min(products.length - 5, prev + 1));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
      />
    ));
  };

  const ProductCard = ({ product }) => (
    <div className="relative flex flex-col bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform duration-300">
      {/* image and discount section */}
      <div className="relative group hover:scale-95 transition-transform duration-300">
        <div className="absolute top-2 left-2 bg-pink-500 text-white text-sm px-2 py-1 rounded">
          -{product.discount}%
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <div className="flex my-2">{renderStars(product.rating)}</div>

        <div className="flex items-center">
          <span className="text-xl font-bold text-primary-foreground">
            ${product.newPrice}
          </span>
          <span className="ml-2 text-sm text-gray-500 line-through">
            ${product.oldPrice}
          </span>
        </div>

        <div className="flex space-x-2 mt-auto">
          <button
            className="flex-1 bg-primary text-white py-2 rounded-md transition-colors duration-300 hover:bg-opacity-90 flex items-center justify-center space-x-1"
          >
            <FaEye className="w-4 h-4" />
            <span>Quick View</span>
          </button>
          <button
            className="bg-secondary text-primary-foreground p-2 rounded-md transition-colors duration-300 hover:bg-opacity-90"
          >
            <FaHeart className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-6 py-2 rounded-md transition-colors duration-300 ${activeTab === "hotDeals"
            ? "bg-primary text-white"
            : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setActiveTab("hotDeals")}
        >
          Hot Deals
        </button>
        <button
          className={`px-6 py-2 rounded-md transition-colors duration-300 ${activeTab === "newProducts"
            ? "bg-primary text-white"
            : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setActiveTab("newProducts")}
        >
          New Products
        </button>
      </div>

      {/* Product Carousel */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex mb-4 transition-transform duration-300"
            style={{ transform: `translateX(-${startIndex * 20}%)` }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-none w-1/5 px-2">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePrevClick}
          disabled={startIndex === 0}
          aria-label="Previous products"
        >
          <FaChevronLeft className="w-6 h-6 text-primary-foreground" />
        </button>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNextClick}
          disabled={startIndex >= products.length - 5}
          aria-label="Next products"
        >
          <FaChevronRight className="w-6 h-6 text-primary-foreground" />
        </button>
        
      </div>
    </div>
  );
};

export default ProductHighlights;