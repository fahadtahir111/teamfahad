import apiClient from '@/lib/api-client';

export const orderService = {
    async getAll(email?: string) {
        const url = email ? `/orders?email=${email}` : '/orders';
        const { data } = await apiClient.get(url);
        return data;
    },

    async create(orderData: any) {
        const { data } = await apiClient.post('/orders', orderData);
        return data;
    },

    async getById(id: string) {
        const { data } = await apiClient.get(`/orders/${id}`);
        return data;
    },

    async updateStatus(id: string, status: string) {
        const { data } = await apiClient.put(`/api/orders/status/${id}`, { status });
        return data;
    }
};
