import api from "../config/axios";

export const fetchQuizzes = async () => {
    try {
        const response = await api.get("/skinQuestion/getDeleteIsFalse");
        return response.data;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        throw new Error("Failed to fetch quizzes. Please try again later.");
    }
};

export const fetchQuiz = async (id) => {
    try {
        const response = await api.get(`/skinQuestion/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching quiz:", error);
        throw new Error("Failed to fetch quiz. Please try again later.");
    }
};

export const createQuiz = async (quiz) => {
    try {
        const response = await api.post("/skinQuestion/create", quiz);
        return response.data;
    } catch (error) {
        console.error("Error creating quiz:", error);
        throw new Error("Failed to create quiz. Please try again later.");
    }
};

export const updateQuiz = async (id, quiz) => {
    try {
        const response = await api.put(`/skinQuestion/update/${id}`, quiz);
        return response.data;
    } catch (error) {
        console.error("Error updating quiz:", error);
        throw new Error("Failed to update quiz. Please try again later.");
    }
};

export const deleteQuiz = async (id) => {
    try {
        const response = await api.delete(`/skinQuestion/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting quiz:", error);
        throw new Error("Failed to delete quiz. Please try again later.");
    }
};