import client from '../client';

// Get all tasks
export const getTasks = async () => {
    const { data } = await client.get('/tasks');
    return data;
};

// Create task
export const createTask = async (title: string, description?: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const { data } = await client.post('/tasks', { title, description, priority });
    return data;
};

// Update task
export const updateTask = async (id: number, title: string, description?: string) => {
    const { data } = await client.patch(`/tasks/${id}`, { title, description });
    return data;
};

// Toggle task complete
export const toggleComplete = async (id: number) => {
    const { data } = await client.patch(`/tasks/${id}/complete`);
    return data;
};

// Delete task
export const deleteTask = async (id: number) => {
    await client.delete(`/tasks/${id}`);
};

// Start timer
export const startTimer = async (id: number) => {
    await client.post(`/time-tracking/${id}/timer/start`);
};

// Stop timer
export const stopTimer = async (id: number) => {
    await client.post(`/time-tracking/${id}/timer/stop`);
};