import api from "../config/axios";

export const getOrdersFromStaff = async () => {
    try {
        const response = await api.get('/get-by-current-staff');
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders. Please try again later.");
    }
}