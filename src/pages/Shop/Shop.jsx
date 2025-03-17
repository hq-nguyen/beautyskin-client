import { useState, useEffect, useMemo } from "react";
import { Slider } from "antd";
import { assets } from "../../assets/frontend_assets/assets";
import { fetchProducts } from '../../apis/product';
import { ProductAttributeService } from "../../apis/productAttribute";
import ProductItem from "../../components/Card/ProductItem";
import { useLocation } from "react-router-dom"; // Import useLocation

const Shop = () => {
  const location = useLocation(); //dùng useLocation để lấy category và giá trị lọc
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinConcerns, setSkinConcerns] = useState([]);
  const [textures, setTextures] = useState([]);
  const [feedbackData, setFeedbackData] = useState(null);

  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 10000000], 
    skinType: [],
    skinConcern: [],
    texture: []
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");

  const filterMap = {
    skinType: {
      oily: null, 
      dry: null,
      normal: null,
      combination: null
    },
    skinConcern: {
      dehydrated: null,
      uneven: null,
      aging: null,
      pores: null,
      acne: null,
      elasticity: null
    },
    texture: {
      cream: null,
      gel: null,
      foam: null,
      cleanser: null,
      serum: null
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const storedQuery = localStorage.getItem('searchQuery');
        const storedFilteredProducts = localStorage.getItem('filteredProducts');
        
        if (storedQuery) {
          setSearchQuery(storedQuery);
        }
        
        if (storedFilteredProducts) {
          const filteredProducts = JSON.parse(storedFilteredProducts).filter(
            product => product.status !== 'OUT_OF_STOCK' && product.status !== 'INSUFFICIENT_STOCK' && product.stock > 0
          );
          setProducts(filteredProducts);
        } else {
          const data = await fetchProducts();
          const availableProducts = data.filter(
            product => product.status !== 'OUT_OF_STOCK' && product.status !== 'INSUFFICIENT_STOCK' && product.stock > 0
          );
          setProducts(availableProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const [cate, text, skinType, concerns] = await Promise.all([
          ProductAttributeService.getCategories(),
          ProductAttributeService.getTextures(),
          ProductAttributeService.getSkinType(),
          ProductAttributeService.getConcern(),
        ]);

        setCategories(cate);
        setTextures(text);
        setSkinTypes(skinType);
        setSkinConcerns(concerns);

        // Dùng filterMap để ánh xạ giá trị của filter từ product classification sang id từ api
        skinType.forEach(type => {
          if (type.name.toLowerCase().includes("dầu")) filterMap.skinType.oily = type.id;
          if (type.name.toLowerCase().includes("khô")) filterMap.skinType.dry = type.id;
          if (type.name.toLowerCase().includes("thường")) filterMap.skinType.normal = type.id;
          if (type.name.toLowerCase().includes("hỗn hợp")) filterMap.skinType.combination = type.id;
        });
        concerns.forEach(concern => {
          if (concern.name.toLowerCase().includes("mất nước")) filterMap.skinConcern.dehydrated = concern.id;
          if (concern.name.toLowerCase().includes("đều màu")) filterMap.skinConcern.uneven = concern.id;
          if (concern.name.toLowerCase().includes("lão hóa")) filterMap.skinConcern.aging = concern.id;
          if (concern.name.toLowerCase().includes("lỗ chân lông")) filterMap.skinConcern.pores = concern.id;
          if (concern.name.toLowerCase().includes("mụn")) filterMap.skinConcern.acne = concern.id;
          if (concern.name.toLowerCase().includes("đàn hồi")) filterMap.skinConcern.elasticity = concern.id;
        });
        text.forEach(form => {
          if (form.name.toLowerCase().includes("kem")) filterMap.texture.cream = form.id;
          if (form.name.toLowerCase().includes("gel")) filterMap.texture.gel = form.id;
          if (form.name.toLowerCase().includes("sữa")) filterMap.texture.foam = form.id;
          if (form.name.toLowerCase().includes("dung dịch")) filterMap.texture.cleanser = form.id;
          if (form.name.toLowerCase().includes("serum")) filterMap.texture.serum = form.id;
        });

        // Apply query parameters from URL
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get("category");
        const filterValue = queryParams.get("filter");

        if (category && filterValue && filterMap[category]?.[filterValue]) {
          setFilters(prev => ({
            ...prev,
            [category]: [filterMap[category][filterValue]]
          }));
        }
      } catch (error) {
        console.error("Error fetching product attributes:", error);
      }
    };

    fetchAttributes();
  }, [location.search]); // Re-run when URL changes

  const getFilterCounts = (filterType, options) => {
    const counts = {};
    
    options.forEach(option => {
      let count = 0;
      
      products.forEach(product => {
        if (filterType === 'category') {
          if (product.category && product.category.id === option.id) count++;
        } 
        else if (filterType === 'skinType') {
          if (product.skinTypes && product.skinTypes.some(type => type.id === option.id)) count++;
        }
        else if (filterType === 'skinConcern') {
          if (product.skinConcerns && product.skinConcerns.some(concern => concern.id === option.id)) count++;
        }
        else if (filterType === 'texture') {
          if (product.forms && product.forms.some(form => form.id === option.id)) count++;
        }
      });
      
      counts[option.id] = count;
    });
    
    return counts;
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const priceInRange = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesCategory = filters.category.length === 0 || 
        filters.category.some(catId => product.category && product.category.id === catId);
      const matchesSkinType = filters.skinType.length === 0 || 
        (product.skinTypes && product.skinTypes.some(type => filters.skinType.includes(type.id)));
      const matchesSkinConcern = filters.skinConcern.length === 0 || 
        (product.skinConcerns && product.skinConcerns.some(concern => filters.skinConcern.includes(concern.id)));
      const matchesTexture = filters.texture.length === 0 || 
        (product.forms && product.forms.some(form => filters.texture.includes(form.id)));
      const matchesSearch = !searchQuery || 
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return priceInRange && matchesCategory && matchesSkinType && 
             matchesSkinConcern && matchesTexture && matchesSearch;
    });

    switch (sortBy) {
      case "low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        filtered.sort((a, b) => b.price - b.price);
        break;
      case "hot":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        break;
      default:
        break;
    }

    return filtered;
  }, [filters, products, searchQuery, sortBy]);

  const handleSort = (sortType) => {
    setSortBy(sortType);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === "priceRange") {
        return { ...prev, priceRange: value };
      }
      
      const updatedValues = prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value];
      
      return { ...prev, [filterType]: updatedValues };
    });
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      localStorage.setItem('searchQuery', query);
    } else {
      localStorage.removeItem('searchQuery');
      localStorage.removeItem('filteredProducts');
    }
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 10000000],
      skinType: [],
      skinConcern: [],
      texture: []
    });
    setSearchQuery("");
    setSortBy("");  
    
    localStorage.removeItem('searchQuery');
    localStorage.removeItem('filteredProducts');
    
    fetchProducts().then(data => {
      const availableProducts = data.filter(
        product => product.status !== 'OUT_OF_STOCK' && product.status !== 'INSUFFICIENT_STOCK'
      );
      setProducts(availableProducts);
    });
  };

  const FilterSection = ({ title, options, filterType }) => {
    const counts = getFilterCounts(filterType, options);
    
    return (
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">{title}</h3>
        <div className="space-y-2">
          {options.map(option => (
            <label key={option.id} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters[filterType].includes(option.id)}
                  onChange={() => handleFilterChange(filterType, option.id)}
                  className="form-checkbox text-primary h-4 w-4"
                />
                <span className="text-sm">{option.name}</span>
              </div>
              <span className="text-sm text-gray-500">({counts[option.id]})</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const getPromotionPercentage = (product) => {
    if (product.promotions && product.promotions.length > 0) {
      return 20; 
    }
    return 20;
  };

  const getDiscountedPrice = (product) => {
    if (product.promotions && product.promotions.length > 0) {
      return product.price - (product.price * 0.2); 
    }
    return product.price;
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return assets.product_new_1;
  };

  return (
    <div className="min-h-screen bg-background bg-gray-50 my-8">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/5 space-y-6 bg-card p-6 rounded-lg h-fit sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Mua hàng</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary/80"
              >
                Xóa lọc
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Tìm kiếm</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full p-2 pr-8 border rounded-lg"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <svg
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <FilterSection title="Danh mục" options={categories} filterType="category" />
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Lọc theo giá</h3>
              <Slider
                range
                min={0}
                max={10000000}
                step={100000}
                defaultValue={[0, 10000000]}
                value={filters.priceRange}
                onChange={(value) => handleFilterChange("priceRange", value)}
                tipFormatter={(value) => `${value.toLocaleString()} đ`}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>{filters.priceRange[0].toLocaleString()} đ</span>
                <span>{filters.priceRange[1].toLocaleString()} đ</span>
              </div>
            </div>
            <FilterSection title="Loại da" options={skinTypes} filterType="skinType" />
            <FilterSection title="Mối quan tâm về da" options={skinConcerns} filterType="skinConcern" />
            <FilterSection title="Kết cấu sản phẩm" options={textures} filterType="texture" />
          </div>

          {/* Product Listing */}
          <div className="lg:w-4/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-primary font-bold">Tất cả sản phẩm</h2>
              <div className="text-sm">
                Hiển thị {filteredAndSortedProducts.length} sản phẩm
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-2 mb-4 bg-white rounded-lg shadow-sm">
              <div className="flex space-x-2 text-sm">
                <span className="mr-2">Sắp xếp</span>
                <button
                  className={`text-xs px-2 py-1 rounded text-black hover:border-rose-500 hover:border ${sortBy === "hot" ? "bg-primary text-white" : "bg-white border"}`}
                  onClick={() => handleSort("hot")}
                >
                  Bán chạy
                </button>
                <button
                  className={`text-xs px-2 py-1 rounded text-black hover:border-rose-500 hover:border ${sortBy === "newest" ? "bg-primary text-white" : "bg-white border"}`}
                  onClick={() => handleSort("newest")}
                >
                  Mới nhất
                </button>
                <button
                  className={`text-xs px-2 py-1 rounded text-black hover:border-rose-500 hover:border ${sortBy === "low-high" ? "bg-primary text-white" : "bg-white border"}`}
                  onClick={() => handleSort("low-high")}
                >
                  Giá thấp đến cao
                </button>
                <button
                  className={`text-xs px-2 py-1 rounded text-black hover:border-rose-500 hover:border ${sortBy === "high-low" ? "bg-primary text-white" : "bg-white border"}`}
                  onClick={() => handleSort("high-low")}
                >
                  Giá cao đến thấp
                </button>
              </div>
            </div>

            {searchQuery && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  Kết quả tìm kiếm cho: <span className="font-semibold">"{searchQuery}"</span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  id={product.id}
                  image={getProductImage(product)}
                  promotion={getPromotionPercentage(product)}
                  name={product.name}
                  oldPrice={product.price}
                  newPrice={getDiscountedPrice(product)}
                  stock={product.stock}
                  status={product.status}
                />
              ))}
            </div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;