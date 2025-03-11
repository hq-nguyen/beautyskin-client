import api from '../config/axios';

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

export default api; 
