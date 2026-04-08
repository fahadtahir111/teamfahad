import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Global error handling
        const message = error.response?.data?.message || error.response?.data?.error || 'An unexpected error occurred';

        if (error.response?.status === 401) {
            // Handle unauthorized (e.g., redirect to login)
            console.error('Unauthorized access - 401');
        }

        console.error(`API Error: ${message}`);
        return Promise.reject(error);
    }
);

export default apiClient;
