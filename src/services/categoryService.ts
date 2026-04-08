import apiClient from '@/lib/api-client';

export const categoryService = {
    async getAll() {
        const { data } = await apiClient.get('/categories');
        return data;
    },

    async create(categoryData: any) {
        const { data } = await apiClient.post('/categories', categoryData);
        return data;
    },

    async update(id: string, categoryData: any) {
        const { data } = await apiClient.put(`/categories/${id}`, categoryData);
        return data;
    },

    async delete(id: string) {
        const { data } = await apiClient.delete(`/categories/${id}`);
        return data;
    }
};
