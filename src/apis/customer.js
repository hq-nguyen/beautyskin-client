import api from "../config/axios";

export const fetchCustomer = async () => {
    try {
        const response = await api.get('/get'); 
        return response.data;
    } catch (error) {
        console.error("Error fetching customer account:", error);
        throw new Error("Failed to fetch customer. Please try again later.");
    }
};

export const fetchStaff = async () => {
    try {
        const response = await api.get('/getStaff'); 
        return response.data;
    } catch (error) {
        console.error("Error fetching customer account:", error);
        throw new Error("Failed to fetch customer. Please try again later.");
    }
};

export const deleteCustomer = async (id) => {
    try {
        const response = await api.delete(`/user/delete/${id}`);
        console.log(response); 
        return response;
    } catch (error) {
        console.error(`Error deleting customer with ID ${id}:`, error);
        throw new Error("Failed to delete customer. Please try again later.");
    }
};

// lock customer
export const lockAccount = async (id) => {
    try {
        const response = await api.put(`/user/lock/${id}`);
        console.log(response); 
        return response;
    } catch (error) {
        console.error(`Error locking customer with ID ${id}:`, error);
        throw new Error("Failed to lock customer. Please try again later.");
    }
};


export const unLockAccount = async (id) => {
    try {
        const response = await api.put(`/user/unlock/${id}`);
        console.log(response); 
        return response;
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

export const getSkinProfile = async ( id) => {
    try {
        const response = await api.get(`/skin-profile/get-by-user/${id}`);
        console.log(response.data);
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
