import api from '../config/axios';

export const fetchRoutines = async () => {
    try {
        const response = await api.get('/routine/getAll');
        return response.data;
    } catch (error) {
        console.error("Error fetching routines:", error);
        throw error;
    }
};

export const createRoutine = async (routineData) => {
    try {
        const formattedData = {
            name: routineData.name,
            description: routineData.description,
            skinTypeId: routineData.skinTypeId,
            routineStepRequests: routineData.routineStepResponse.map(step => ({
                stepName: step.stepName,
                description: step.description,
                stepOrder: step.stepOrder,
                products: Array.isArray(step.productResponse)
                    ? step.productResponse.map(product => ({
                        id: typeof product === 'object' ? product.id : parseInt(product, 10)
                    }))
                    : []
            }))
        };

        const response = await api.post('/routine/createRoutine', formattedData);
        return response.data;
    } catch (error) {
        console.error("Error creating routine:", error);
        throw error;
    }
};

export const updateRoutine = async (routineId, routineData) => {
    try {
        const basicRoutineData = {
            name: routineData.name,
            description: routineData.description,
            skinTypeId: routineData.skinTypeId
        };

        await api.put(
            `/routine/update/${routineId}/${basicRoutineData.skinTypeId}?name=${encodeURIComponent(basicRoutineData.name)}&description=${encodeURIComponent(basicRoutineData.description)}`
        );

        const currentRoutine = await getRoutineById(routineId);
        const currentStepIds = currentRoutine.routineStepResponse
            ? currentRoutine.routineStepResponse.map(step => step.id)
            : [];

        for (const stepId of currentStepIds) {
            try {
                await deleteRoutineStep(stepId);
            } catch (err) {
                console.error(`Failed to delete step ${stepId}:`, err);
            }
        }

        if (routineData.routineStepResponse && routineData.routineStepResponse.length > 0) {
            const stepsToCreate = routineData.routineStepResponse.map((step, index) => ({
                stepName: step.stepName,
                description: step.description,
                stepOrder: index + 1, 
                products: Array.isArray(step.productResponse)
                    ? step.productResponse.map(product => {
                        const productId = typeof product === 'object' ? product.id : parseInt(product, 10);
                        return { id: productId };
                    })
                    : []
            }));

            for (const stepData of stepsToCreate) {
                await createRoutineStep(routineId, stepData);
            }
        }

        const updatedRoutine = await getRoutineById(routineId);
        return updatedRoutine;
    } catch (error) {
        console.error(`Error updating routine with ID ${routineId}:`, error);
        throw error;
    }
};

export const getRoutineById = async (routineId) => {
    try {
        const response = await api.get(`/routine/getRoutineById/${routineId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching routine with ID ${routineId}:`, error);
        throw error;
    }
};

export const getRoutineBySkinType = async (skinTypeId) => {
    try {
        const response = await api.get(`/routine/getRoutineBySkinType/${skinTypeId}`, {
            params: {
                skinTypeId: skinTypeId
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching routine for skin type ${skinTypeId}:`, error);
        throw error;
    }
}

export const createRoutineStep = async (routineId, stepData) => {
    try {
        const response = await api.post(`/routine/createRoutineStep/${routineId}`, stepData);
        return response.data;
    } catch (error) {
        console.error("Error creating routine step:", error);
        throw error;
    }
};

export const updateRoutineStep = async (stepId, stepData) => {
    try {
        const response = await api.put(`/routine/updateRoutineStep/${stepId}`, stepData);
        return response.data;
    } catch (error) {
        console.error(`Error updating routine step with ID ${stepId}:`, error);
        throw error;
    }
};

export const deleteRoutineStep = async (stepId) => {
    try {
        const response = await api.delete(`/routine/deleteRoutineStep/${stepId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting routine step with ID ${stepId}:`, error);
        throw error;
    }
};

export const deleteRoutine = async (routineId) => {
    try {
        const response = await api.delete(`/routine/delete/${routineId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting routine with ID ${routineId}:`, error);
        throw error;
    }
};