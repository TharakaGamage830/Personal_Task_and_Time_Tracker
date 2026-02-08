import client from '../client';

// Get dashboard stats
export const getStats = async () => {
    const { data } = await client.get('/dashboard/stats');
    return data;
};