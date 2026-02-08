import client from '../client';

// Login
export const login = async (email: string, password: string) => {
    const { data } = await client.post('/auth/login', { email, password });
    return data;
};

// Register
export const register = async (name: string, email: string, password: string) => {
    const { data } = await client.post('/auth/register', { name, email, password });
    return data;
};

// Get current user
export const getCurrentUser = async () => {
    const { data } = await client.get('/auth/me');
    return data;
};

// Get user with token (for login steps)
export const getUserWithToken = async (token: string) => {
    const { data } = await client.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};