import api from "../config/axios";
import {message} from "antd";

export const createOrder = async (data) => {
    try {
        const payload = await api.post("order", data);
        return payload.data;
    } catch (error) {
        message.error(error.response.data);
    }
}

export const updateStatusOrder = async (id, status) => {
    try {
        const payload = await api.patch(`order/updateStatus/${id}?status=${status}&`);
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