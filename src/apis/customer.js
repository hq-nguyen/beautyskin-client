import api from "../config/axios";

// Fetch all staffs
export const fetchCustomer = async () => {
    try {
        const response = await api.get('/get'); // Use relative URL
        return response.data;
    } catch (error) {
        console.error("Error fetching customer account:", error);
        // Handle error more gracefully (e.g., display a user-friendly message)
        throw new Error("Failed to fetch customer. Please try again later.");
    }
};

export const deleteCustomer = async (id) => {
    try {
        const response = await api.delete(`/user/delete/${id}`);
        console.log(response); // Inspect the response
        return response; // You can return the response if needed
    } catch (error) {
        console.error(`Error deleting customer with ID ${id}:`, error);
        throw new Error("Failed to delete customer. Please try again later.");
    }
};

// lock customer
export const lockCustomer = async (id) => {
    try {
        const response = await api.put(`/user/lock/${id}`);
        console.log(response); 
        return response; // You can return the response if needed
    } catch (error) {
        console.error(`Error locking customer with ID ${id}:`, error);
        throw new Error("Failed to lock customer. Please try again later.");
    }
};


export const unLockCustomer = async (id) => {
    try {
        const response = await api.put(`/user/unlock/${id}`);
        console.log(response); 
        return response; // You can return the response if needed
    } catch (error) {
        console.error(`Error locking customer with ID ${id}:`, error);
        throw new Error("Failed to lock customer. Please try again later.");
    }
};

export const createSkinProfile = async (skinPoint) => {
    try {
        const response = await api.post('/skin-profile/create', null, {
            params: {
                skinPoint: skinPoint
            }
        });
        console.log('Skin profile updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating skin profile:', error);
        throw new Error("Có lỗi xảy ra khi lưu dữ liệu loại da của bạn. Xin thông cảm!");
    }
};

export const getSkinProfile = async (id) => {
    try {
        const response = await api.get(`/skin-profile/get-by-user/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating skin profile:', error);
        throw new Error("Có lỗi xảy ra khi lưu dữ liệu loại da của bạn. Xin thông cảm!");
    }
};


// staff 
export const createStaff = async (staff) => {
    try {
        const response = await api.post('/user/create-staff', staff);
        console.log('Staff created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating staff:', error);
        throw new Error("Có lỗi xảy ra khi tạo nhân viên. Xin thông cảm!");
    }
} 
