import api from '../config/axios';
export default api;
// Fetch all products
export const fetchProducts = async () => {
    try {
        const response = await api.get('/product/get');
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products. Please try again later.");
    }
};

// Fetch a product by ID
export const fetchProductById = async (productId) => {
    try {
        const response = await api.get(`/product/getById/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with ID ${productId}:`, error);
        throw new Error("Failed to fetch product. Please try again later.");
    }
};

// Update a product
export const updateProduct = async (productId, productData) => {
    try {
        const response = await api.put(`/product/update/${productId}`, productData);
        return response.data; 
    } catch (error) {
        console.error(`Error updating product with ID ${productId}:`, error);
        throw new Error(`Failed to update product. Please try again later.`);
    }
};

// Add a new product
export const addProduct = async (productData) => {
    try {
        const response = await api.post('/product/create', productData);
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw new Error("Failed to add product. Please try again later.");
    }
};


// Delete a product
export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/product/delete/${productId}`);
        // debug
        console.log(response);
        return response;
    } catch (error) {
        console.error(`Error deleting product with ID ${productId}:`, error);
        throw new Error("Failed to delete product. Please try again later.");
    }
};

export const getProductBySkinType = async (id) => {
    try {
        const response = await api.get(`/product/getBySkinTypes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error);
        throw new Error("Failed to fetch product. Please try again later.");
    }
};

export const getProductByCategory = async (id) => {
    try {
        const response = await api.get(`/product/getFormCate/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error);
        throw new Error("Failed to fetch product. Please try again later.");
    }
}


export const mapSkinTypeToId = (skinType) => {
    const skinTypeMap = {
      'Da dầu': 1,
      'Da hỗn hợp / tổng hợp': 2,
      'Da thường': 3,
      'Da nhạy cảm': 4,
      'Da khô': 5,
    };
    
    return skinTypeMap[skinType] || 1; // Mặc định là Da dầu nếu không tìm thấy
  };
