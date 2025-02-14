import axios from 'axios';

// Use environment variable for API URL (if available)
const API_BASE_URL = "https://6785075f1ec630ca33a6df91.mockapi.io";

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // Optional: set a timeout
    // Optional: Add common headers here (e.g., authorization)
    // headers: {
    //   'Authorization': `Bearer ${localStorage.getItem('token')}`
    // }
});

// Fetch all products
export const fetchProducts = async () => {
    try {
        const response = await axiosInstance.get('/Product'); // Use relative URL
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products. Please try again later.");
    }
};

// Update a product
export const updateProduct = async (productId, productData) => {
    try {
        const response = await axiosInstance.put(`/Product/${productId}`, productData);
        return response.data; // Or handle response as needed
    } catch (error) {
        console.error(`Error updating product with ID ${productId}:`, error);
        throw new Error(`Failed to update product. Please try again later.`);
    }
};

// Add a new product
export const addProduct = async (productData) => {
    try {
        const response = await axiosInstance.post('/Product', productData);
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw new Error("Failed to add product. Please try again later.");
    }
};


// Delete a product
export const deleteProduct = async (productId) => {
    try {
        const response = await axiosInstance.delete(`/Product/${productId}`);
        // debug
        console.log(response);
        return response;
    } catch (error) {
        console.error(`Error deleting product with ID ${productId}:`, error);
        throw new Error("Failed to delete product. Please try again later.");
    }
};

export default axiosInstance; 
