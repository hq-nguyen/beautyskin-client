import api from "../config/axios";

export const makeReport = async (data) => {
    try {
        const response = await api.post("/report", data);
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }
}