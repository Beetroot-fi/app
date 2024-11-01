import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { UserRead } from "./types/user";
import { TaskRead } from "./types/tasks";
import { AuthTokens, CustomAxiosRequestConfig } from "./types/api";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const refreshAuthTokens = async (): Promise<AuthTokens> => {
    const refresh_token = localStorage.getItem('refreshToken');
    if (!refresh_token) {
        throw new Error('No refresh token available');
    }

    const response = await api.post<AuthTokens>('/api/v1/auth/refresh', {
        refresh_token
    });

    const { access_token, refresh_token: new_refresh_token } = response.data;
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', new_refresh_token);

    return response.data;
};

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

api.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.url !== '/api/v1/auth/login' && config.url !== '/api/v1/auth/refresh') {
            config.headers['token'] = token;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        if (error.response?.status === 401 &&
            originalRequest &&
            originalRequest.url !== '/api/v1/auth/refresh' &&
            !originalRequest._retry) {
            if (isRefreshing) {
                try {
                    const token = await new Promise<string>((resolve) => {
                        subscribeTokenRefresh((token: string) => {
                            resolve(token);
                        });
                    });
                    if (originalRequest.headers) {
                        originalRequest.headers['token'] = token;
                    }
                    return api(originalRequest);
                } catch (err) {
                    return Promise.reject(err);
                }
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { access_token } = await refreshAuthTokens();
                onTokenRefreshed(access_token);
                if (originalRequest.headers) {
                    originalRequest.headers['token'] = access_token;
                }
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export const apiService = {
    login: async (initData: string) => {
        try {
            const response = await api.post<AuthTokens>('/api/v1/auth/login', {
                "query_str": initData
            });

            const { access_token, refresh_token } = response.data;
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);

            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    refreshTokens: async () => {
        try {
            return await refreshAuthTokens();
        } catch (error) {
            console.error('Token refresh error:', error);
            throw error;
        }
    },

    getUser: async () => {
        try {
            const response = await api.get<UserRead>('/api/v1/users/');
            return response;
        } catch (error) {
            console.error('Failed to fetch user data:', error)
            throw error;
        }
    },

    getUserReferrals: async () => {
        try {
            const response = await api.get<UserRead[]>('/api/v1/users/referrals');
            return response;
        } catch (error) {
            console.error('Failed to fetch user referrals:', error)
            throw error;
        }
    },

    getTasks: async () => {
        try {
            const response = await api.get<TaskRead[]>('/api/v1/tasks');
            return response;
        } catch (error) {
            console.error('Failed to fetch tasks:', error)
            throw error;
        }
    },

    getCompletedTasks: async () => {
        try {
            const response = await api.get<TaskRead[]>('/api/v1/tasks/completed');
            return response;
        } catch (error) {
            console.error('Failed to fetch completed tasks:', error)
            throw error;
        }
    },

    completeTask: async (taskId: string) => {
        try {
            const response = await api.post(`/api/v1/tasks/complete?task_id=${taskId}`);
            return response;
        } catch (error) {
            console.error('Failed to complete task:', error)
            throw error;
        }
    }
};
