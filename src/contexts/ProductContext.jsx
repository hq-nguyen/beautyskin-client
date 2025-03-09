import { createContext, useState, useEffect } from 'react';
import { fetchProducts } from '../apis/product';
import { ProductAttributeService } from '../apis/productAttribute';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [skinTypes, setSkinTypes] = useState([]);
    const [skinConcerns, setSkinConcerns] = useState([]);
    const [textures, setTextures] = useState([]);
    const [tags, setTags] = useState([]);
    const [origins, setOrigins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: [],
        priceRange: { from: "", to: "" },
        brands: [],
        skinType: [],
        skinConcern: [],
        texture: [],
        tag: [],
        origin: []
    });

    const [sortBy, setSortBy] = useState("newest");
    const [tempPriceRange, setTempPriceRange] = useState({ from: "", to: "" });

    useEffect(() => {
        const getProductsAndFilters = async () => {
            try {
                setLoading(true);
                await fetchAttributeData();
                const data = await fetchProducts();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products and attributes:", error);
                setLoading(false);
            }
        };
        getProductsAndFilters();
    }, []);

    const fetchAttributeData = async () => {
        try {
            await fetchCategories();
            await fetchTextures();
            await fetchSkinTypes();
            await fetchSkinConcerns();
            await fetchTags();
            
            // Extract brands and origins from products if needed
            // This could be implemented later if separate API endpoints are available
        } catch (error) {
            console.error("Error fetching attribute data:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const cate = await ProductAttributeService.getCategories();
            setCategories(cate);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchTextures = async () => {
        try {
            const text = await ProductAttributeService.getTextures();
            setTextures(text);
        } catch (error) {
            console.error("Error fetching textures:", error);
        }
    };

    const fetchSkinTypes = async () => {
        try {
            const skinTypes = await ProductAttributeService.getSkinType();
            setSkinTypes(skinTypes);
        } catch (error) {
            console.error("Error fetching skin types:", error);
        }
    };

    const fetchSkinConcerns = async () => {
        try {
            const skinConcerns = await ProductAttributeService.getConcern();
            setSkinConcerns(skinConcerns);
        } catch (error) {
            console.error("Error fetching skin concerns:", error);
        }
    };

    const fetchTags = async () => {
        try {
            const tags = await ProductAttributeService.getTags();
            setTags(tags);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    // Helper functions to get names and IDs
    const getCategoryNameById = (id) => {
        const category = categories.find(cat => cat.id === id);
        return category ? category.name : "";
    };

    const getSkinTypeNameById = (id) => {
        const skinType = skinTypes.find(type => type.id === id);
        return skinType ? skinType.name : "";
    };

    const getSkinConcernNameById = (id) => {
        const skinConcern = skinConcerns.find(concern => concern.id === id);
        return skinConcern ? skinConcern.name : "";
    };

    const getTextureNameById = (id) => {
        const texture = textures.find(tex => tex.id === id);
        return texture ? texture.name : "";
    };

    const getTagNameById = (id) => {
        const tag = tags.find(t => t.id === id);
        return tag ? tag.name : "";
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            if (filterType === "priceRange") {
                setTempPriceRange({ ...tempPriceRange, ...value });
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
            priceRange: { ...tempPriceRange }
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
            tag: [],
            origin: []
        });
        setTempPriceRange({ from: "", to: "" });
    };

    // Calculate filtered products based on the filters
    const getFilteredProducts = () => {
        return products.filter(product => {
            const priceInRange = (!filters.priceRange.from || product.price >= Number(filters.priceRange.from)) &&
                (!filters.priceRange.to || product.price <= Number(filters.priceRange.to));

            const matchesCategory = filters.category.length === 0 || 
                filters.category.includes(getCategoryNameById(product.categoryId));
            
            const matchesBrand = filters.brands.length === 0; // Adjust as needed
            
            const matchesSkinType = filters.skinType.length === 0 ||
                product.skinTypeId?.some(id => 
                    filters.skinType.includes(getSkinTypeNameById(id))
                );
            
            const matchesTexture = filters.texture.length === 0 || 
                filters.texture.includes(getTextureNameById(product.textureId));
            
            const matchesOrigin = filters.origin.length === 0; // Adjust as needed
            
            const matchesSkinConcern = filters.skinConcern.length === 0 ||
                product.skinConcernId?.some(id => 
                    filters.skinConcern.includes(getSkinConcernNameById(id))
                );
            
            const matchesTag = filters.tag.length === 0 ||
                product.tagId?.some(id => 
                    filters.tag.includes(getTagNameById(id))
                );

            return priceInRange && matchesCategory && matchesBrand && matchesSkinType &&
                matchesTexture && matchesOrigin && matchesSkinConcern && matchesTag;
        });
    };

    // Sort products based on the selected sort option
    const getSortedProducts = () => {
        const filtered = getFilteredProducts();
        
        switch (sortBy) {
            case "low-high":
                return [...filtered].sort((a, b) => a.price - b.price);
            case "high-low":
                return [...filtered].sort((a, b) => b.price - a.price);
            case "hot":
                return [...filtered].sort((a, b) => {
                    const aRating = a.rating || 0;
                    const bRating = b.rating || 0;
                    return bRating - aRating;
                });
            case "newest":
                return [...filtered].sort((a, b) => {
                    const aDate = new Date(a.createDateTime);
                    const bDate = new Date(b.createDateTime);
                    return bDate - aDate;
                });
            default:
                return filtered;
        }
    };

    const value = {
        products: getSortedProducts(),
        allProducts: products,
        categories,
        brands,
        skinTypes,
        skinConcerns,
        textures,
        tags,
        origins,
        filters,
        loading,
        handleFilterChange,
        applyPriceRangeFilter,
        clearFilters,
        sortBy,
        setSortBy,
        tempPriceRange,
        setTempPriceRange,
        // Helper functions
        getCategoryNameById,
        getSkinTypeNameById,
        getSkinConcernNameById,
        getTextureNameById,
        getTagNameById
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};