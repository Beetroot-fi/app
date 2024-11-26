import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiService = {
    login: async (initData: string) => {
        try {
            const response = await api.post('/v1/auth/login', {
                "query_str": initData
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deposit: async (walletAddress: string) => {
        try {
            const response = await api.post('/v1/process/deposit', { "wallet_address": walletAddress });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    withdraw: async (walletAddress: string) => {
        try {
            const response = await api.post('/v1/process/withdraw', { "wallet_address": walletAddress });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    metrics: async () => {
        try {
            const response = await api.get('/v1/metrics/');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
