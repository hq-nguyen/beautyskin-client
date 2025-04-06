import api from '../config/axios';
export default api;
export const fetchBlogs = async () => {
    try {
        const response = await api.get('/blog/get');
        return response.data;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error("Failed to fetch blogs. Please try again later.");
    }
};

export const fetchBlogById = async (id) => {
    try {
        const response = await api.get(`/blog/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching blog with ID ${id}:`, error);
        throw new Error("Failed to fetch blog details. Please try again later.");
    }
};

export const fetchBlogsIsFalse = async () => {
    try {
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

export const editBlog = async (id, data) => {
    try {
        const response = await api.put(`/blog/edit/${id}`, data);
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