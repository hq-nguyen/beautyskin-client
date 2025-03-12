import axios from 'axios';

// Use environment variable for API URL (if available)
const API_BASE_URL = "https://67af2a599e85da2f020fbe91.mockapi.io";

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
export const fetchOrder = async () => {
    try {
        const response = await axiosInstance.get('/Order'); // Use relative URL
        return response.data;
    } catch (error) {
        console.error("Error fetching order account:", error);
        // Handle error more gracefully (e.g., display a user-friendly message)
        throw new Error("Failed to fetch order. Please try again later.");
    }
};

// Delete a staffs
export const deleteOrder = async (orderID) => {
    try {
        const response = await axiosInstance.delete(`/Order/${orderID}`);
        console.log(response); // Inspect the response
        return response; // You can return the response if needed
    } catch (error) {
        console.error(`Error deleting order with ID ${orderID}:`, error);
        throw new Error("Failed to delete order. Please try again later.");
    }
};
