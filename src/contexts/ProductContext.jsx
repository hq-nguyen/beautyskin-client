import { createContext, useState, useEffect } from 'react';
import { fetchProducts } from '../apis/product';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
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
    const [tempPriceRange, setTempPriceRange] = useState({ from: "", to: "" });
    useEffect(() => {
        const getProductsAndFilters = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);

                // Extract distinct values from the product data
                const distinctCategories = [...new Set(data.map(product => product.category))];
                const distinctBrands = [...new Set(data.map(product => product.brand))];
                const distinctSkinTypes = [...new Set(data.flatMap(product => product.skinType))];
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

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            if (filterType === "priceRange") {
                return prev;
            }
            const updatedValues = prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value];
            return { ...prev, [filterType]: updatedValues };
        });
    };

    const applyPriceRangeFilter = () => {
        setFilters(prev => ({
            ...prev,
            priceRange: { from: prev.priceRange }
        }));
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

    const value = {
        products,
        categories,
        brands,
        skinTypes,
        skinConcerns,
        textures,
        origins,
        filters,
        handleFilterChange,
        applyPriceRangeFilter,
        clearFilters,
        sortBy,
        setSortBy,
        tempPriceRange,
        setTempPriceRange
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
