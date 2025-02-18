import { useState, useEffect, useMemo } from "react";
import { FiShoppingCart, FiEye } from "react-icons/fi";
import { assets } from "../../assets/frontend_assets/assets";
import { fetchProducts } from '../../apis/product';
import PropTypes from 'prop-types';
import ProductItem from "../../components/ProductItem/ProductItem";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinConcerns, setSkinConcerns] = useState([]);
  const [textures, setTextures] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    priceRange: { from: "", to: "" },
    brands: [],
    skinType: [],
    skinConcern: [],
    texture: [],
    origin: []
  });

  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBrand, setSearchBrand] = useState("");
  const [tempPriceRange, setTempPriceRange] = useState({ from: "", to: "" }); // Temporary state for price range

  useEffect(() => {
    const getProductsAndFilters = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);

        // Extract distinct values from the product data
        const distinctCategories = [...new Set(data.map(product => product.category))];
        const distinctBrands = [...new Set(data.map(product => product.brand))];
        const distinctSkinTypes = [...new Set(data.flatMap(product => product.skinType))]; // Use flatMap if skinType is an array
        const distinctSkinConcerns = [...new Set(data.flatMap(product => product.skinConcern))];
        const distinctTextures = [...new Set(data.map(product => product.texture))];
        const distinctOrigins = [...new Set(data.map(product => product.origin))];

        setCategories(distinctCategories);
        setBrands(distinctBrands);
        setSkinTypes(distinctSkinTypes);
        setSkinConcerns(distinctSkinConcerns);
        setTextures(distinctTextures);
        setOrigins(distinctOrigins);

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getProductsAndFilters();
  }, []);

  // test only
  const categoriesTest = ['Đặc trị', 'Chăm sóc da', 'Thiết bị', 'Makeup'];


  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const priceInRange = (!filters.priceRange.from || product.price >= Number(filters.priceRange.from)) &&
        (!filters.priceRange.to || product.price <= Number(filters.priceRange.to));

      const matchesCategory = filters.category.length === 0 || filters.category.includes(product.category);
      const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const matchesSkinType = filters.skinType.length === 0 ||
        filters.skinType.some(type => product.skinType.includes(type));
      const matchesTexture = filters.texture.length === 0 || filters.texture.includes(product.texture);
      const matchesOrigin = filters.origin.length === 0 || filters.origin.includes(product.origin);
      const matchesSkinConcern = filters.skinConcern.length === 0 ||
        filters.skinConcern.some(concern => product.skinConcern.includes(concern));

      return priceInRange && matchesCategory && matchesBrand && matchesSkinType &&
        matchesTexture && matchesOrigin && matchesSkinConcern;
    });
  }, [filters, products]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === "priceRange") {
        // Store the temporary price range values
        setTempPriceRange({ ...prev.priceRange, ...value });
        return prev; // Return the previous state without applying the filter
      }
      const updatedValues = prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value];
      return { ...prev, [filterType]: updatedValues };
    });
    setCurrentPage(1);
  };

  // Function to apply the temporary price range filter
  const applyPriceRangeFilter = () => {
    setFilters(prev => ({
      ...prev,
      priceRange: { ...tempPriceRange } // Apply the temporary price range values
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: { from: "", to: "" },
      brands: [],
      skinType: [],
      skinConcern: [],
      texture: [],
      origin: []
    });
  };


  const FilterSection = ({ title, options, filterType }) => (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters[filterType].includes(option)}
              onChange={() => handleFilterChange(filterType, option)}
              className="form-checkbox text-primary h-4 w-4"
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )


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

            <FilterSection title="Danh mục" options={categoriesTest} filterType="category" />

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Lọc theo giá</h3>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Từ"
                  value={tempPriceRange.from}
                  onChange={(e) => handleFilterChange("priceRange", { from: e.target.value })}
                  className="w-full px-1 py-1 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Đến"
                  value={tempPriceRange.to}
                  onChange={(e) => handleFilterChange("priceRange", { to: e.target.value })}
                  className="w-full px-1 py-1 border rounded-md"
                />
              </div>
              <button
                onClick={applyPriceRangeFilter}
                className="mt-2 w-full bg-primary text-white py-1 rounded-md hover:bg-primary/80"
              >
                Apply
              </button>
            </div>

            <FilterSection title="Brand" options={brands} filterType="brands" />
            <FilterSection title="Loại da" options={skinTypes} filterType="skinType" />
            <FilterSection title="Mối quan tâm về da" options={skinConcerns} filterType="skinConcern" />
            <FilterSection title="Kết cấu sản phẩm" options={textures} filterType="texture" />
            <FilterSection title="Xuất xứ sản phẩm" options={origins} filterType="origin" />
          </div>

          {/* Product Listing */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                //  image, promotion, name, rating, oldPrice, newPrice
                <ProductItem
                  key={index}
                  id={product.id}
                  image={product.images && product.images.length > 0 ? product.images[0] : assets.product_new_1}
                  promotion={20}
                  name={product.name}
                  rating={product.rating}
                  oldPrice={product.price}
                  newPrice={product.price - product.price * 0.2}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Shop.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  filterType: PropTypes.string.isRequired,
};

export default Shop;
