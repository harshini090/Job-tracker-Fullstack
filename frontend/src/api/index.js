import api from './axios';

export const login = async (username, password) => {
    const { data } = await api.post('/api/token/', { username, password });
    return data;
};

export const signup = async (username, email, password) => {
    const { data } = await api.post('/api/signup/', { username, email, password });
    return data;
};

export const fetchApplications = async () => {
    const { data } = await api.get('/api/applications/');
    return data;
};

export const createApplication = async (payload) => {
    const { data } = await api.post('/api/applications/', payload);
    return data;
};

export const updateApplication = async (id, payload) => {
    const { data } = await api.patch(`/api/applications/${id}/`, payload);
    return data;
};

export const deleteApplication = async (id) => {
    const { data } = await api.delete(`/api/applications/${id}/`);
    return data;
};
