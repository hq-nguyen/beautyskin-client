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

// Fetch all staffs
export const fetchStaff = async () => {
    try {
        const response = await axiosInstance.get('/StaffAccount'); // Use relative URL
        return response.data;
    } catch (error) {
        console.error("Error fetching staff account:", error);
        // Handle error more gracefully (e.g., display a user-friendly message)
        throw new Error("Failed to fetch staff. Please try again later.");
    }
};

// Delete a staffs
export const deleteStaff = async (productId) => {
    try {
        const response = await axiosInstance.delete(`/StaffAccount/${productId}`);
        console.log(response); // Inspect the response
        return response; // You can return the response if needed
    } catch (error) {
        console.error(`Error deleting staff with ID ${productId}:`, error);
        throw new Error("Failed to delete staff. Please try again later.");
    }
};

export const addStaff = async (productData) => {
    try {
        const response = await axiosInstance.post('/StaffAccount', productData);
        return response.data;
    } catch (error) {
        console.error("Error adding staff:", error);
        throw new Error("Failed to add staff. Please try again later.");
    }
};