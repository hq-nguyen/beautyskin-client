import axios from 'axios';

const API_BASE_URL = 'http://14.225.210.92:8080/api/';

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // Optional: set a timeout
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

export default api;

// Fetch all blogs
export const fetchBlogs = async () => {
    try {
        // const response = await api.get('/Blog');
        const response = await api.get('/blog/get');
        return response.data;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error("Failed to fetch blogs. Please try again later.");
    }
};

export const fetchBlogsIsFalse = async () => {
    try {
        // const response = await api.get('/Blog');
        const response = await api.get('/blog/getByDeleteIsFalse');
        return response.data;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error("Failed to fetch blogs. Please try again later.");
    }
};

export const addBlog = async (blog) => {
    try {
        const response = await api.post('/blog/create', blog);
        return response.data;
    } catch (error) {
        console.error("Error adding blog:", error);
        throw new Error("Failed to add blog. Please try again later.");
    }
};

export const editBlog = async (id) => {
    try {
        const response = await api.put(`/blog/edit/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error editing blog:", error);
        throw new Error("Failed to edit blog. Please try again later.");
    }
};

export const deleteBlog = async (id) => {
    try {
        const response = await api.delete(`/blog/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting blog:", error);
        throw new Error("Failed to delete blog. Please try again later.");
    }
};