import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";


const api: AxiosInstance = axios.create({
    baseURL: "https://api.beetroot.finance",
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');

        if (token && config.url !== '/login') {
            config.headers['access-token'] = token;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export const apiService = {
    login: async (initData: string) => {
        try {
            const response = await api.post('/api/v1/auth/login', { "query_str": initData });

            const { accessToken, refreshToken } = response.data;

            // Сохраняем токены
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    get: <T>(url: string, params?: object) => {
        return api.get<T>(url, { params });
    },

    post: <T>(url: string, data?: object) => {
        return api.post<T>(url, data);
    },
};