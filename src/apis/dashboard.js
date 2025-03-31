import api from "../config/axios";

export const getDashboardSummary = () => {
    try {
        const response = api.get('/dashboard/stats');
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const getRevenueByMonth = () => {
    try {
        const response = api.get('/dashboard/monthly-revenue');
        return response;
    } catch (error) {
        console.log(error);
    }
} 

export const getRevenueOfMonthByYear = (year) => {
    try {
        const response = api.get(`dashboard/monthly-revenue-year?year=${year}`);
        return response;
    } catch (error) {
        console.log(error);
    }
} 