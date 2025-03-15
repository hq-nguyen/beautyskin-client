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

