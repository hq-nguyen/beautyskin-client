import { useState, useEffect, useMemo } from "react";
import { Slider } from "antd";
import { assets } from "../../assets/frontend_assets/assets";
import { fetchProducts } from '../../apis/product';
import { ProductAttributeService } from "../../apis/productAttribute";
import ProductItem from "../../components/Card/ProductItem";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinConcerns, setSkinConcerns] = useState([]);
  const [textures, setTextures] = useState([]);
  const [tags, setTags] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 10000000], // Default price range in VND
    skinType: [],
    skinConcern: [],
    texture: []
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getProducts();
  }, []);

  // Fetch product attributes
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const [cate, text, skinType, concerns, tagList] = await Promise.all([
          ProductAttributeService.getCategories(),
          ProductAttributeService.getTextures(),
          ProductAttributeService.getSkinType(),
          ProductAttributeService.getConcern(),
          ProductAttributeService.getTags()
        ]);

        setCategories(cate);
        setTextures(text);
        setSkinTypes(skinType);
        setSkinConcerns(concerns);
        setTags(tagList);
      } catch (error) {
        console.error("Error fetching product attributes:", error);
      }
    };

    fetchAttributes();
  }, []);

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Price range filter
      const priceInRange = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

      // Category filter
      const matchesCategory = filters.category.length === 0 || 
        filters.category.some(catId => product.category && product.category.id === catId);
      
      // Skin type filter
      const matchesSkinType = filters.skinType.length === 0 || 
        (product.skinTypes && product.skinTypes.some(type => filters.skinType.includes(type.id)));
      
      // Skin concern filter
      const matchesSkinConcern = filters.skinConcern.length === 0 || 
        (product.skinConcerns && product.skinConcerns.some(concern => filters.skinConcern.includes(concern.id)));
      
      // Texture filter
      const matchesTexture = filters.texture.length === 0 || 
        (product.forms && product.forms.some(form => filters.texture.includes(form.id)));
      
      // Search query filter
      const matchesSearch = !searchQuery || 
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return priceInRange && matchesCategory && matchesSkinType && 
             matchesSkinConcern && matchesTexture && matchesSearch;
    });
  }, [filters, products, searchQuery]);

  // Handle filter changes
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

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 10000000],
      skinType: [],
      skinConcern: [],
      texture: []
    });
    setSearchQuery("");
  };

  // Filter section component
  const FilterSection = ({ title, options, filterType }) => (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        {options.map(option => (
          <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters[filterType].includes(option.id)}
              onChange={() => handleFilterChange(filterType, option.id)}
              className="form-checkbox text-primary h-4 w-4"
            />
            <span className="text-sm">{option.name}</span>
          </label>
        ))}
      </div>
    </div>
  );

  // Function to get promotional discount percentage
  const getPromotionPercentage = (product) => {
    if (product.promotions && product.promotions.length > 0) {
      return 20; // Default 20% as you had in your original code
    }
    return 20;
  };

  // Function to calculate discounted price
  const getDiscountedPrice = (product) => {
    if (product.promotions && product.promotions.length > 0) {
      return product.price - (product.price * 0.2); // 20% discount
    }
    return product.price;
  };

  // Function to get the first image from product images array
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
          <div className="lg:w-1/4 space-y-6 bg-card p-6 rounded-lg h-fit sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Mua hàng</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary/80"
              >
                Xóa lọc
              </button>
            </div>

            {/* Search bar */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Tìm kiếm</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full p-2 pr-8 border rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Price Range Filter with Slider */}
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
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  id={product.id}
                  image={getProductImage(product)}
                  promotion={getPromotionPercentage(product)}
                  name={product.name}
                  rating={product.rating || 5}
                  oldPrice={product.price}
                  newPrice={getDiscountedPrice(product)}
                  stock={product.stock}
                  status={product.status}
                />
              ))}
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 && (
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