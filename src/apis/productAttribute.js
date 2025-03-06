    import axios from 'axios';

    import api from '../config/axios';

    const mockConcerns = [
        { id: 1, name: 'Acne' },
        { id: 2, name: 'Aging' },
        { id: 3, name: 'Hydration' }
    ];

    const mockTextures = [
        { id: 1, name: 'Gel' },
        { id: 2, name: 'Cream' },
        { id: 3, name: 'Lightweight' }
    ];

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
        //   getTextures: () => axios.get(`${API_BASE_URL}/texture`),
        //   createTexture: (data) => axios.post(`${API_BASE_URL}/texture`, data),
        //   updateTexture: (id, data) => axios.put(`${API_BASE_URL}/texture/${id}`, data),
        //   deleteTexture: (id) => axios.delete(`${API_BASE_URL}/texture/${id}`)

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

        getTextures: () => Promise.resolve({ data: mockTextures }),
        createTexture: (data) => {
            const newTexture = { ...data, id: mockTextures.length + 1 };
            mockTextures.push(newTexture);
            return Promise.resolve(newTexture);
        },
        updateTexture: (id, data) => {
            const index = mockTextures.findIndex(t => t.id === id);
            if (index !== -1) {
                mockTextures[index] = { ...mockTextures[index], ...data };
            }
            return Promise.resolve(mockTextures[index]);
        },
        deleteTexture: (id) => {
            const index = mockTextures.findIndex(t => t.id === id);
            if (index !== -1) {
                mockTextures.splice(index, 1);
            }
            return Promise.resolve();
        }
    };