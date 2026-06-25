import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    withXSRFToken: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 419 && !originalRequest._retry) {
            originalRequest._retry = true;
            // El endpoint de sanctum no contiene el prefijo "api/v*/", por eso es una URL diferente
            await api.get('/sanctum/csrf-cookie', {baseURL: process.env.NEXT_PUBLIC_SERVER_URL});
            return api(originalRequest);
        }

        return Promise.reject(error);
    }
);