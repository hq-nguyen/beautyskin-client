import axios from 'axios';

// Use environment variable for API URL (if available)
const API_BASE_URL = "https://67af2a599e85da2f020fbe91.mockapi.io";
// const API_BASE_URL = 'http://14.225.210.92:8080/api/';

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // Optional: set a timeout
});

export default api;

// import api from '../config/axios'

// Fetch all blogs
export const fetchBlogs = async () => {
    try {
        const response = await api.get('/Blog');
        // const response = await api.get('/blog/get');
        return response.data;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error("Failed to fetch blogs. Please try again later.");
    }
};