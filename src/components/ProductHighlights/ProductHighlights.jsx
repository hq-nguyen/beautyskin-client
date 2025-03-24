import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { fetchProducts } from "../../apis/product";
import ProductItem from "../Card/ProductItem";

const ProductHighlights = () => {
  const [activeTab, setActiveTab] = useState("hotDeals");
  const [products, setProducts] = useState([]);
  const [hotDealsProducts, setHotDealsProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        
        // Process products data
        if (data && data.length > 0) {
          // Sort by stock for hot deals (highest stock first)
          const sortedByStock = [...data].sort((a, b) => b.stock - a.stock).slice(0, 7);
          
          // Sort by date for new products (newest first)
          const sortedByDate = [...data].sort((a, b) => 
            new Date(b.createDateTime) - new Date(a.createDateTime)
          ).slice(0, 7);
          
          setHotDealsProducts(sortedByStock);
          console.log("hot deals:",sortedByStock);
          
          setNewProducts(sortedByDate);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    // Update displayed products based on active tab
    setProducts(activeTab === "hotDeals" ? hotDealsProducts : newProducts);
  }, [activeTab, hotDealsProducts, newProducts]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480, // xs
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Calculate discount percentage
  const calculateDiscount = (originalPrice, discountPrice) => {
    if (!originalPrice || !discountPrice || originalPrice <= discountPrice) return 20;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  // Get current price after applying promotions (if any)
  const getCurrentPrice = (product) => {
    if (product.promotions && product.promotions.length > 0) {
      // Find the active promotion with the highest discount
      const activePromotion = product.promotions
        .filter(promo => new Date(promo.endDateTime) >= new Date())
        .sort((a, b) => b.discountPercentage - a.discountPercentage)[0];
      
      if (activePromotion) {
        return product.price * (1 - activePromotion.discountPercentage / 100);
      }
    }
    return product.price;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 bg-white rounded-lg shadow-lg mt-24 text-center">
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

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
        {/* View all products link */}
        <Link to="/shop" className="hidden lg:block">
          <button className="text-sm px-4 py-2 bg-gray-50 hover:text-white rounded-full border border-rose-600 hover:bg-rose-600 transition-colors duration-150">
            Xem tất cả sản phẩm
          </button>
        </Link>
      </div>

      {/* Product Slider */}
      <div className="px-4">
        <Slider {...sliderSettings}>
          {products.map((product) => {
            const currentPrice = getCurrentPrice(product);
            const discount = calculateDiscount(product.price, currentPrice);
            const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : "";
            
            return (
              <div key={product.id} className="px-2">
                <ProductItem
                  id={product.id}
                  image={imageUrl}
                  promotion={discount}
                  name={product.name}
                  oldPrice={product.price}
                  newPrice={currentPrice}
                />
              </div>
            );
          })}
        </Slider>
      </div>

      {/* Button for small screens */}
      <div className="lg:hidden flex justify-center mt-8">
        <Link to="/shop">
          <button className="text-sm font-semibold px-4 py-2 bg-gray-600 text-white rounded-full shadow hover:bg-pink-600 transition-colors duration-300">
            Xem tất cả sản phẩm
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductHighlights;