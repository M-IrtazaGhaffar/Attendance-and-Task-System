"use client";
import Cookies from "js-cookie";

import axios from "axios";

const baseAuthURL = '/api/v1/auth'
const baseUserURL = '/api/v1/user'
const baseAdminURL = '/api/v1/admin'

// const authBaseUserURL = 'http://localhost:5000/v1/auth'
// const localBaseUserURL = 'http://localhost:5000/v1/user'
// const localBaseAdminURL = 'http://localhost:5000/v1/admin'

const authApi = axios.create({
    baseURL: baseAuthURL,
    headers: {
        "Content-Type": "application/json",
    },
});

const userApi = axios.create({
    baseURL: baseUserURL,
    headers: {
        "Content-Type": "application/json",
    },
});

userApi.interceptors.request.use(
    async (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    }
)

userApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            console.warn("Organization token expired or forbidden. Logging out...");
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
);

const adminApi = axios.create({
    baseURL: baseAdminURL,
    headers: {
        "Content-Type": "application/json",
    },
});

adminApi.interceptors.request.use(
    async (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    }
)

adminApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            console.warn("Organization token expired or forbidden. Logging out...");
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
);

export { userApi, adminApi, authApi };