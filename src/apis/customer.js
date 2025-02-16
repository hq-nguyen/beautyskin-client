import axios from 'axios';

// Use environment variable for API URL (if available)
// const API_BASE_URL = "https://67af2a599e85da2f020fbe91.mockapi.io";

const API_BASE_URL = "http://14.225.210.92:8080/api";

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // Optional: set a timeout
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});



// Fetch all staffs
export const fetchCustomer = async () => {
    try {
        const response = await axiosInstance.get('/get'); // Use relative URL
        return response.data;
    } catch (error) {
        console.error("Error fetching customer account:", error);
        // Handle error more gracefully (e.g., display a user-friendly message)
        throw new Error("Failed to fetch customer. Please try again later.");
    }
};

// Delete a staffs
export const deleteCustomer = async (id) => {
    try {
        const response = await axiosInstance.delete(`/user/delete/${id}`);
        console.log(response); // Inspect the response
        return response; // You can return the response if needed
    } catch (error) {
        console.error(`Error deleting customer with ID ${id}:`, error);
        throw new Error("Failed to delete customer. Please try again later.");
    }
};
