import { InternalAxiosRequestConfig } from "axios";


export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}