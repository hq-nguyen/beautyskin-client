import api from '../config/axios';

// Get all skincare routines
export const fetchRoutines = async () => {
    try {
        const response = await api.get('/routine/getAll');
        return response.data;
    } catch (error) {
        console.error("Error fetching routines:", error);
        throw error;
    }
};

// Create a new skincare routine with all steps in one request
export const createRoutine = async (routineData) => {
    try {
        const response = await api.post('/routine/createRoutine', routineData);
        return response.data;
    } catch (error) {
        console.error("Error creating routine:", error);
        throw error;
    }
};

export const updateRoutine = async (routineId, routineData) => {
    try {
        const { name, description, skinTypeId, routineStepRequests, deletedStepIds } = routineData;

        // First update the basic routine information
        await api.put(
            `/routine/update/${routineId}/${skinTypeId}?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`
        );

        // Handle any steps that were already deleted through the UI
        // but we want to make sure they're properly deleted in the database
        if (deletedStepIds && deletedStepIds.length > 0) {
            // These steps were already deleted via deleteRoutineStep API in the UI,
            // but we're double-checking to ensure deletion was successful
            const deletePromises = deletedStepIds.map(async (stepId) => {
                try {
                    // Attempt to delete again - this will likely return an error if already deleted,
                    // but we can safely ignore that
                    await deleteRoutineStep(stepId);
                } catch (error) {
                    // Likely already deleted, so we can ignore this error
                    console.log(`Step ID ${stepId} may have already been deleted or doesn't exist`, error);
                }
            });

            await Promise.all(deletePromises);
        }

        // Process remaining steps (update existing ones, create new ones)
        if (routineStepRequests && routineStepRequests.length > 0) {
            const stepPromises = routineStepRequests.map(step => {
                if (step.id) {
                    // Only update steps that weren't deleted
                    if (!deletedStepIds?.includes(step.id)) {
                        return updateRoutineStep(step.id, {
                            stepName: step.stepName,
                            description: step.description,
                            stepOrder: step.stepOrder,
                            products: step.products.map(product => {
                                if (typeof product === 'object' && product.id) {
                                    return { id: product.id };
                                }
                                return { id: typeof product === 'string' ? parseInt(product, 10) : product };
                            })
                        });
                    }
                    return Promise.resolve(); // Skip deleted steps
                } else {
                    // Create new steps
                    return createRoutineStep(routineId, {
                        stepName: step.stepName,
                        description: step.description,
                        stepOrder: step.stepOrder,
                        products: step.products.map(product => {
                            if (typeof product === 'object' && product.id) {
                                return { id: product.id };
                            }
                            return { id: typeof product === 'string' ? parseInt(product, 10) : product };
                        })
                    });
                }
            });

            // Wait for all step operations to complete
            await Promise.all(stepPromises);
        }

        return true; // Return success
    } catch (error) {
        console.error(`Error updating routine with ID ${routineId}:`, error);
        throw error;
    }
};

export const getRoutineById = async (routineId) => {
    try {
        const response = await api.get(`/routine/getById/${routineId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching routine with ID ${routineId}:`, error);
        throw error;
    }
};

// Create a single routine step
export const createRoutineStep = async (routineId, stepData) => {
    try {
        const response = await api.post(`/routine/createRoutineStep/${routineId}`, stepData);
        return response.data;
    } catch (error) {
        console.error("Error creating routine step:", error);
        throw error;
    }
};

// Update a single routine step
export const updateRoutineStep = async (stepId, stepData) => {
    try {
        const response = await api.put(`/routine/updateRoutineStep/${stepId}`, stepData);
        return response.data;
    } catch (error) {
        console.error(`Error updating routine step with ID ${stepId}:`, error);
        throw error;
    }
};

// Delete a routine step
export const deleteRoutineStep = async (stepId) => {
    try {
        const response = await api.delete(`/routine/deleteRoutineStep/${stepId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting routine step with ID ${stepId}:`, error);
        throw error;
    }
};

// Delete an entire routine
export const deleteRoutine = async (routineId) => {
    try {
        const response = await api.delete(`/routine/delete/${routineId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting routine with ID ${routineId}:`, error);
        throw error;
    }
};