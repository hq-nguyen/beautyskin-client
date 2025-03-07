import api from '../config/axios';

export const ProductAttributeService = {
    // categories
    getCategories: async () => {
        try {
            const response = await api.get('category/get');
            return response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw new Error("Failed to fetch categories. Please try again later.");
        }
    },

    createCategory: async (data) => {
        try {
            const response = await api.post('category/create', data);
            return response.data;
        } catch (error) {
            console.error("Error creating category:", error);
            throw new Error("Failed to create category. Please try again later.");
        }
    },

    updateCategory: async (id, data) => {
        try {
            const response = await api.put(`category/update/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating category:", error);
            throw new Error("Failed to update category. Please try again later.");
        }
    },

    deleteCategory: async (id) => {
        try {
            const response = await api.delete(`category/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting category:", error);
            throw new Error("Failed to delete category. Please try again later.");
        }
    },

    // brands
    getBrands: async () => {
        try {
            const response = await api.get('brand/get');
            return response.data;
        } catch (error) {
            console.error("Error fetching brands:", error);
            throw new Error("Failed to fetch brands. Please try again later.");
        }
    },

    createBrand: async (data) => {
        try {
            const response = await api.post('brand/create', data);
            return response.data;
        } catch (error) {
            console.error("Error creating brand:", error);
            throw new Error("Failed to create brand. Please try again later.");
        }
    },

    updateBrand: async (id, data) => {
        try {
            const response = await api.put(`brand/update/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating brand:", error);
            throw new Error("Failed to update brand. Please try again later.");
        }
    },

    deleteBrand: async (id) => {
        try {
            const response = await api.delete(`brand/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting brand:", error);
            throw new Error("Failed to delete brand. Please try again later.");
        }
    },

    // skin types
    getSkinType: async () => {
        try {
            const response = await api.get('skinType/getAll');
            return response.data;
        } catch (error) {
            console.error("Error fetching skin type:", error);
            throw new Error("Failed to fetch skin type. Please try again later.");
        }
    },

    createSkinType: async (data) => {
        try {
            const response = await api.post('skinType/create', data);
            return response.data;
        } catch (error) {
            console.error("Error creating skin type:", error);
            throw new Error("Failed to create skin type. Please try again later.");
        }
    },

    updateSkinType: async (id, data) => {
        try {
            const response = await api.put(`skinType/update/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating skin type:", error);
            throw new Error("Failed to update skin type. Please try again later.");
        }
    },

    deleteSkinType: async (id) => {
        try {
            const response = await api.delete(`skinType/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting skin type:", error);
            throw new Error("Failed to delete skin type. Please try again later.");
        }
    },

    // skin concerns
    getConcern: async () => {
        try {
            const response = await api.get('skinConcern/get');
            return response.data;
        } catch (error) {
            console.error("Error fetching skin concern:", error);
            throw new Error("Failed to fetch skin concern. Please try again later.");
        }
    },

    createConcern: async (data) => {
        try {
            const response = await api.post('skinConcern/create', data);
            return response.data;
        } catch (error) {
            console.error("Error creating skin concern:", error);
            throw new Error("Failed to create skin concern. Please try again later.");
        }
    },

    updateConcern: async (id, data) => {
        try {
            const response = await api.put(`skinConcern/update/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating skin concern:", error);
            throw new Error("Failed to update skin concern. Please try again later.");
        }
    },

    deleteConcern: async (id) => {
        try {
            const response = await api.delete(`skinConcern/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting skin concern:", error);
            throw new Error("Failed to delete skin concern. Please try again later.");
        }
    },

    // textures
    getTextures: async () => {
        try {
            const response = await api.get('form/getAll');
            return response.data;
        } catch (error) {
            console.error("Error fetching textures:", error);
            throw new Error("Failed to fetch textures. Please try again later.");
        }
    },

    createTexture: async (data) => {
        try {
            const response = await api.post('form/create', data);
            return response.data;
        } catch (error) {
            console.error("Error creating texture:", error);
            throw new Error("Failed to create texture. Please try again later.");
        }
    },

    updateTexture: async (id, data) => {
        try {
            const response = await api.put(`form/update/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating texture:", error);
            throw new Error("Failed to update texture. Please try again later.");
        }
    },

    deleteTexture: async (id) => {
        try {
            const response = await api.delete(`form/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting texture:", error);
            throw new Error("Failed to delete texture. Please try again later.");
        }
    },
};