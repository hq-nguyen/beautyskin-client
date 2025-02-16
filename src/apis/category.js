import axios from 'axios';

// Use environment variable for API URL (if available)
const API_BASE_URL = "https://67b0ce3b3fc4eef538e87a1a.mockapi.io";

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // Optional: set a timeout
});

// Fetch all categories
export const fetchCategory = async () => {
    try {
        const response = await axiosInstance.get('/Category'); 
        return response.data;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw new Error("Failed to fetch category. Please try again later.");
    }
};

// Delete a categories
export const deleteCategory = async (categoryID) => {
    try {
        const response = await axiosInstance.delete(`/Category/${categoryID}`);
        console.log(response); // Inspect the response
        return response; // You can return the response if needed
    } catch (error) {
        console.error(`Error deleting category with ID ${categoryID}:`, error);
        throw new Error("Failed to delete category. Please try again later.");
    }
};

// Add a categories
export const addCategory = async (cateData) => {
    try {
        const response = await axiosInstance.post('/Category', cateData);
        return response.data;
    } catch (error) {
        console.error("Error adding category:", error);
        throw new Error("Failed to add category. Please try again later.");
    }
};