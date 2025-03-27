import api from "../config/axios";
import { message } from "antd";

export const createOrder = async (data) => {
    try {
        const queryParams = data.promold
            ? `?promoId=${data.promold}`
            : '';

        const { promold, ...orderData } = data;

        const payload = await api.post(`order${queryParams}`, orderData);
        return payload.data;
    } catch (error) {
        const errorMessage = error.response?.data || 'Đã xảy ra lỗi khi tạo đơn hàng';
        message.error(errorMessage);
        throw error;
    }
};

export const createOrderCOD = async (data) => {
    try {
        const queryParams = data.promold
            ? `?promoId=${data.promold}`
            : '';

        const { promold, ...orderData } = data;

        const payload = await api.post(`order/createCOD${queryParams}`, orderData);
        return payload.data;
    } catch (error) {
        const errorMessage = error.response?.data || 'Đã xảy ra lỗi khi tạo đơn hàng';
        message.error(errorMessage);
        throw error;
    }
};

export const validatePromotionCode = async (promoCode) => {
    try {
        const response = await api.get(`promotion/validate?code=${promoCode}`);
        return response.data;
    } catch (error) {
        message.error(error.response?.data || 'Invalid promotion code');
        return null;
    }
};

export const updateStatusOrder = async (id, status) => {
    try {
        const payload = await api.patch(`order/updateStatusOrder/${id}?status=${status}&`);
        return payload.data;
    } catch (error) {
        message.error(error.response.data);
    }
}

export const updateStatusOrder2 = async (id, status) => {
    try {
        const payload = await api.patch(`order/updateStatusOrder/${id}?status=${status}&`);
        return payload.data;
    } catch (error) {
        message.error(error.response.data);
    }
}

export const updateStatusPayment = async (id, status) => {
    try {

        const payload = await api.patch(`order/updateStatusPayment/${id}?status=${status}&`);
        return payload.data;
    } catch (error) {
        message.error(error.response.data);
    }
}


export const fetchOrderHistory = async () => {
    try {
        const payload = await api.get("order/getByUser");
        return payload.data;
    } catch (error) {
        message.error(error.response.data);
    }
}

export const fetchOrders = async () => {
    try {
        const payload = await api.get("order/getAll");
        return payload.data;
    } catch (error) {
        message.error(error.response.data);
    }
}

export const cancelOrder = async (id) => {
    try {
        const payload = await api.put(`order/cancelOrder/${id}?orderId=${id}`);
        return payload.data;
    } catch (error) {
        message.error(error.response.data);
    }
};

export const makeReport = async (data) => {
    try {
        const response = await api.post("/report", data);
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }
}